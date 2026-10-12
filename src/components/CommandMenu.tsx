import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { currentTheme, toggleTheme } from '../utils/theme';

const navigation = [
  { name: 'log', href: '/' },
  { name: 'projects', href: '/projects/' },
  { name: 'writing', href: '/blog/' },
  { name: 'verse', href: '/verses/' },
  { name: 'podcast', href: '/podcasts/' },
  { name: 'about', href: '/about/' },
];

const elsewhere = [
  { name: 'github', href: 'https://github.com/prassanna-ravishankar' },
  { name: 'linkedin', href: 'https://linkedin.com/in/prassanna-ravishankar' },
  { name: 'x', href: 'https://x.com/thenomadiccoder' },
];

export const CommandMenu = ({ initialOpen = false }: { initialOpen?: boolean }) => {
  const [open, setOpen] = useState(initialOpen);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const onToggle = () => setOpen((o) => !o);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('command-menu-toggle', onToggle);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('command-menu-toggle', onToggle);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (open) setTheme(currentTheme());
  }, [open]);

  if (!open) return null;

  const go = (href: string) => {
    setOpen(false);
    window.location.href = href;
  };

  return (
    <div className="pr-palette-backdrop" onClick={() => setOpen(false)}>
      <Command loop label="Jump to" className="pr-palette" onClick={(e) => e.stopPropagation()}>
        <Command.Input autoFocus placeholder="Jump to…" />
        <Command.List>
          <Command.Empty>Nothing matches.</Command.Empty>
          <Command.Group heading="site">
            {navigation.map((item) => (
              <Command.Item key={item.href} value={item.name} onSelect={() => go(item.href)}>
                <span>{item.name}</span>
                <span className="pr-meta">{item.href}</span>
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="elsewhere">
            {elsewhere.map((item) => (
              <Command.Item key={item.href} value={item.name} onSelect={() => go(item.href)}>
                <span>{item.name}</span>
                <span className="pr-meta">{new URL(item.href).hostname}</span>
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Separator />
          <Command.Group heading="system">
            <Command.Item value="theme" onSelect={() => { toggleTheme(); setOpen(false); }}>
              <span>Switch to {theme === 'dark' ? 'light' : 'dark'} theme</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
};
