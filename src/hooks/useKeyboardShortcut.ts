import { useEffect, useCallback } from 'react';

export type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
};

/**
 * Custom hook for handling keyboard shortcuts
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  callback: () => void,
  enabled = true
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const { key, ctrlKey = false, metaKey = false, shiftKey = false, altKey = false } = shortcut;

      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = ctrlKey === event.ctrlKey;
      const matchesMeta = metaKey === event.metaKey;
      const matchesShift = shiftKey === event.shiftKey;
      const matchesAlt = altKey === event.altKey;

      if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
        event.preventDefault();
        callback();
      }
    },
    [shortcut, callback, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
