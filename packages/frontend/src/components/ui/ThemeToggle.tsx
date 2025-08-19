// packages/frontend/src/components/ui/ThemeToggle.tsx
import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useDarkMode();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1 transition-colors duration-200">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              relative flex items-center justify-center w-10 h-8 rounded-md transition-all duration-200
              ${theme === value 
                ? 'bg-white dark:bg-dark-800 shadow-sm text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200'
              }
            `}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;