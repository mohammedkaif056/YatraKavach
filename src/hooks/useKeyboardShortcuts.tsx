import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface ShortcutDefinition {
  key: string;
  description: string;
  command: (event?: KeyboardEvent) => void;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  global?: boolean;
  permission?: string;
  displayKey?: string;
}

// Define the shortcut mappings
const createShortcuts = (
  navigate: ReturnType<typeof useNavigate>,
  toggleDarkMode: () => void,
  hasPermission: (permission: string) => boolean
): ShortcutDefinition[] => [
  // Navigation shortcuts
  {
    key: 'd',
    description: 'Go to Dashboard',
    command: () => navigate('/police/dashboard'),
    metaKey: true,
    displayKey: '⌘ D',
    global: true,
  },
  {
    key: 'a',
    description: 'Go to Alerts',
    command: () => navigate('/police/alerts'),
    metaKey: true,
    displayKey: '⌘ A',
    global: true,
  },
  {
    key: 'm',
    description: 'Go to Map',
    command: () => navigate('/police/tourists'),
    metaKey: true,
    displayKey: '⌘ M',
    global: true,
  },
  {
    key: 'y',
    description: 'Go to Analytics',
    command: () => navigate('/police/analytics'),
    metaKey: true,
    displayKey: '⌘ Y',
    global: true,
    permission: 'view_analytics',
  },

  // Action shortcuts
  {
    key: 'n',
    description: 'Create new incident',
    command: () => navigate('/police/incidents/create'),
    metaKey: true,
    displayKey: '⌘ N',
    global: true,
    permission: 'create_incidents',
  },
  {
    key: 'f',
    description: 'Search',
    command: () => document.querySelector<HTMLInputElement>('input[type="text"][placeholder*="Search"]')?.focus(),
    metaKey: true,
    displayKey: '⌘ F',
    global: true,
  },
  {
    key: 'k',
    description: 'Toggle dark mode',
    command: toggleDarkMode,
    metaKey: true,
    shiftKey: true,
    displayKey: '⌘ ⇧ K',
    global: true,
  },
  {
    key: '?',
    description: 'Show keyboard shortcuts',
    command: () => document.dispatchEvent(new CustomEvent('show-keyboard-shortcuts')),
    shiftKey: true,
    displayKey: '?',
    global: true,
  },

  // Emergency shortcuts
  {
    key: 'e',
    description: 'Create emergency incident',
    command: () => navigate('/police/incidents/create?type=emergency'),
    metaKey: true,
    shiftKey: true,
    displayKey: '⌘ ⇧ E',
    global: true,
    permission: 'create_incidents',
  },
];

export const useKeyboardShortcuts = (active = true) => {
  const navigate = useNavigate();
  const { isDark, setMode } = useTheme();
  const { hasPermission } = useAuth();
  const [isShowingShortcutsDialog, setShowingShortcutsDialog] = useState(false);

  // Toggle dark mode function to pass to shortcuts
  const toggleDarkMode = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  // Generate shortcut definitions
  const shortcuts = createShortcuts(navigate, toggleDarkMode, hasPermission);

  // Filter shortcuts by permission
  const availableShortcuts = shortcuts.filter(
    shortcut => !shortcut.permission || hasPermission(shortcut.permission)
  );

  // Show keyboard shortcuts dialog
  const showShortcutsDialog = useCallback(() => {
    setShowingShortcutsDialog(true);
  }, []);

  // Hide keyboard shortcuts dialog
  const hideShortcutsDialog = useCallback(() => {
    setShowingShortcutsDialog(false);
  }, []);

  // Handle keyboard events
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore key events in form inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      // Check if the key combination matches any of our shortcuts
      for (const shortcut of availableShortcuts) {
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.metaKey === !!shortcut.metaKey &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.altKey === !!shortcut.altKey &&
          !!event.shiftKey === !!shortcut.shiftKey
        ) {
          event.preventDefault();
          shortcut.command(event);
          return;
        }
      }
    };

    // Handle custom event for showing shortcuts
    const handleShowShortcuts = () => {
      showShortcutsDialog();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('show-keyboard-shortcuts', handleShowShortcuts);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('show-keyboard-shortcuts', handleShowShortcuts);
    };
  }, [active, availableShortcuts, showShortcutsDialog]);

  return {
    shortcuts: availableShortcuts,
    isShowingShortcutsDialog,
    showShortcutsDialog,
    hideShortcutsDialog,
  };
};

// Component for displaying keyboard shortcuts
export const ShortcutsDialog: React.FC = () => {
  // Use try/catch to handle potential circular dependency issues
  try {
    const { shortcuts, isShowingShortcutsDialog, hideShortcutsDialog } = useKeyboardShortcuts();

    if (!isShowingShortcutsDialog || !shortcuts) {
      return null;
    }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
            <button
              onClick={hideShortcutsDialog}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2"
              >
                <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                  {shortcut.displayKey || shortcut.key}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={hideShortcutsDialog}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error rendering shortcuts dialog:', error);
    return null;
  }
};

export default useKeyboardShortcuts;