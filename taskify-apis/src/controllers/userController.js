const fs = require('fs');
const path = require('path');
const { Autosend } = require('autosendjs');
const { getDb } = require('../db/database');
const { hashPassword, verifyPassword, validatePasswordStrength } = require('../utils/password');
const config = require('../config');

const digestTemplate = fs.readFileSync(
  path.join(__dirname, '..', 'templates', 'digest.html'),
  'utf-8'
);

function sanitizeProfile(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url,
    authProvider: user.auth_provider,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function getProfile(req, res, next) {
  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ profile: sanitizeProfile(user) });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, avatarUrl, currentPassword, newPassword } = req.body;
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let nextName = user.name;
    let nextAvatarUrl = user.avatar_url;

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name cannot be empty' });
      }
      nextName = name.trim();
    }

    if (avatarUrl !== undefined) {
      if (avatarUrl !== null && typeof avatarUrl !== 'string') {
        return res.status(400).json({ error: 'avatarUrl must be a string or null' });
      }
      nextAvatarUrl = avatarUrl;
    }

    let nextPasswordHash = user.password_hash;

    if (newPassword !== undefined) {
      if (user.auth_provider !== 'local') {
        return res.status(400).json({
          error: 'Password updates are only available for local accounts. Use your social provider to manage credentials.',
        });
      }

      if (!currentPassword || typeof currentPassword !== 'string') {
        return res.status(400).json({ error: 'currentPassword is required to set a new password' });
      }

      const passwordError = validatePasswordStrength(newPassword);
      if (passwordError) {
        return res.status(400).json({ error: passwordError });
      }

      const validCurrentPassword = await verifyPassword(currentPassword, user.password_hash);
      if (!validCurrentPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      nextPasswordHash = await hashPassword(newPassword);
    }

    db.prepare(`
      UPDATE users
      SET name = ?, avatar_url = ?, password_hash = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(nextName, nextAvatarUrl, nextPasswordHash, user.id);

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);

    return res.json({
      message: 'Profile updated successfully',
      profile: sanitizeProfile(updatedUser),
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.auth_provider === 'local') {
      const { password } = req.body;

      if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Password is required to delete a local account' });
      }

      const validPassword = await verifyPassword(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Password is incorrect' });
      }
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(user.id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function emailDigest(req, res, next) {
  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tasks = db
      .prepare('SELECT * FROM tasks WHERE user_id = ? AND completed = 0 ORDER BY due_date ASC, created_at ASC')
      .all(req.user.id);

    const taskRows = tasks.length === 0
      ? '<tr><td style="padding: 0 0 24px 0;"><p style="font-size:15px;color:#787774;">You have no pending tasks — great work!</p></td></tr>'
      : tasks.map((t, i) => {
          const due = t.due_date
            ? new Date(t.due_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
            : null;
          const separator = i > 0
            ? '<tr><td style="padding: 0 0 24px 0;"><hr style="margin:0;border:none;border-top:1px solid #dddcd7;"></td></tr>'
            : '';
          return `${separator}<tr><td style="padding: 0 0 24px 0; display: block;">
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #2a3b19;">${escapeHtml(t.title)}</p>
                    ${due ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #787774;">Due: <strong>${due}</strong></p>` : ''}
                    ${t.description ? `<p style="margin: 0; font-size: 15px; color: #37352f; line-height: 1.5;">${escapeHtml(t.description)}</p>` : ''}
                  </td></tr>`;
        }).join('');

    const html = digestTemplate
      .replace('{{userName}}', escapeHtml(user.name))
      .replace('{{taskRows}}', taskRows)
      .replace('{{unsubscribeUrl}}', '#');

    const autosend = new Autosend(config.autosend.apiKey);

    await autosend.emails.send({
      from: { email: config.autosend.from, name: config.autosend.fromName },
      to: { email: user.email, name: user.name },
      subject: `Your Taskify digest — ${tasks.length} pending task${tasks.length !== 1 ? 's' : ''}`,
      html,
    });

    return res.json({ message: `Digest sent to ${user.email}` });
  } catch (error) {
    return next(error);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  emailDigest,
};
