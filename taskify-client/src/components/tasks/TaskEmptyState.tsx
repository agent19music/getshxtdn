import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';

interface TaskEmptyStateProps {
  segment: 'pending' | 'completed';
  onAddTask?: () => void;
}

export function TaskEmptyState({ segment, onAddTask }: TaskEmptyStateProps) {
  if (segment === 'pending') {
    return (
      <EmptyState
        icon={'\u2705'} // checkmark
        title="All clear!"
        subtitle="No pending tasks. Tap + to add one."
        actionLabel="Add a task"
        onAction={onAddTask}
      />
    );
  }

  return (
    <EmptyState
      icon={'\u{1F3C6}'} // trophy
      title="Nothing completed yet"
      subtitle="Complete a task and it will show up here."
    />
  );
}
