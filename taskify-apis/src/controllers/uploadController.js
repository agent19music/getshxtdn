const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');
const { uploadToR2, deleteFromR2 } = require('../utils/r2');

// Extract R2 key from a public URL so we can delete the old file
function keyFromUrl(url, publicUrl) {
  if (!url || !publicUrl) return null;
  return url.startsWith(publicUrl) ? url.slice(publicUrl.length + 1) : null;
}

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, mimetype, originalname } = req.file;
    const ext = originalname.split('.').pop() ?? 'jpg';
    const key = `avatars/${req.user.id}/${uuidv4()}.${ext}`;

    const avatarUrl = await uploadToR2(buffer, key, mimetype);

    // Delete the old avatar from R2 if it exists
    const db = getDb();
    const user = db.prepare('SELECT avatar_url FROM users WHERE id = ?').get(req.user.id);
    if (user?.avatar_url) {
      const oldKey = keyFromUrl(user.avatar_url, process.env.R2_PUBLIC_URL);
      if (oldKey) deleteFromR2(oldKey).catch(() => {}); // fire-and-forget
    }

    // Persist the new URL
    db.prepare(`
      UPDATE users SET avatar_url = ?, updated_at = datetime('now') WHERE id = ?
    `).run(avatarUrl, req.user.id);

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    return res.json({
      avatarUrl,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        avatarUrl: updated.avatar_url,
        authProvider: updated.auth_provider,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { uploadAvatar };
