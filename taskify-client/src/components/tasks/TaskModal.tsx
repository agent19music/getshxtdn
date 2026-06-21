import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import type { Task } from '@/types';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; dueDate?: string }) => Promise<void>;
  task?: Task | null;
}

export function TaskModal({ visible, onClose, onSubmit, task }: TaskModalProps) {
  const { colors } = useTheme();
  const isEditing = task != null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setDueDate(task?.dueDate ? new Date(task.dueDate) : null);
      setError('');
    }
  }, [visible, task]);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() || undefined,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <View style={styles.actions}>
      <Button label="Cancel" onPress={onClose} variant="secondary" style={styles.actionButton} />
      <Button label={isEditing ? 'Save' : 'Create'} onPress={handleSubmit} loading={loading} style={styles.actionButton} />
    </View>
  );

  return (
    <Modal visible={visible} onClose={onClose} footer={footer}>
      <Text style={[styles.heading, { color: colors.foreground }]}>
        {isEditing ? 'Edit task' : 'New task'}
      </Text>

      <Input
        label="Title"
        placeholder="What needs to be done?"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (error) setError('');
        }}
        autoFocus
        returnKeyType="next"
        error={error}
        containerStyle={styles.field}
      />

      <Input
        label="Description"
        placeholder="Add details (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        containerStyle={styles.field}
      />

      <DateTimePicker
        label="Due date & time"
        value={dueDate}
        onChange={setDueDate}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...Typography.h3,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.base,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
