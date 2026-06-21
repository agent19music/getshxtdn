import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'phosphor-react-native';
import { toast } from 'sonner-native';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/hooks/use-theme';
import { uploadAvatar } from '@/services/user.api';
import type { User } from '@/types';

interface AvatarUploadProps {
  user: User;
  size?: number;
  onUploadSuccess: (updated: User) => void;
}

export function AvatarUpload({ user, size = 80, onUploadSuccess }: AvatarUploadProps) {
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);

  async function handlePress() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.error('Permission required', {
        description: 'Allow photo library access to upload an avatar.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? 'image/jpeg';

    try {
      setUploading(true);
      const updated = await uploadAvatar(asset.uri, mimeType);
      onUploadSuccess(updated);
      toast.success('Avatar updated');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      toast.error('Upload failed', { description: message });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={uploading}
      style={styles.wrapper}
      accessibilityLabel="Change avatar"
      accessibilityRole="button"
    >
      <Avatar uri={user.avatarUrl} name={user.name} size={size} />

      {/* Camera badge overlay */}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.primaryBg,
            borderColor: colors.surface,
          },
        ]}
      >
        {uploading ? (
          <ActivityIndicator size={12} color={colors.primaryText} />
        ) : (
          <Camera size={14} color={colors.primaryText} weight="bold" />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
