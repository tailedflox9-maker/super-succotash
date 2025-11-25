// src/components/ThemeToggle.tsx

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Initialize from localStorage or default to dark
    const savedTheme = localStorage.getItem('ai-tutor-theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  useEffect(() => {
    // Apply theme to html element
    const html = document.documentElement;
    
    if (theme === 'light') {
      html.classList.add('light');
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
      html.classList.remove('light');
    }
    
    // Save to localStorage
    localStorage.setItem('ai-tutor-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="interactive-button p-2.5 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-all duration-200"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-[var(--color-text-secondary)] transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--color-text-secondary)] transition-transform duration-300 hover:rotate-90" />
      )}
    </button>
  );
};
