import { useEffect, useRef, useState } from 'react';
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
  const [open, setOpenState] = useState(initialOpen);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  // Radix returns focus to a Dialog.Trigger; this palette opens from ⌘K or the footer, so return focus to whatever opened it.
  const returnTo = useRef<Element | null>(initialOpen ? document.activeElement : null);

  const openRef = useRef(open);
  openRef.current = open;

  const setOpen = (next: boolean) => {
    if (next) {
      returnTo.current = document.activeElement;
    } else {
      const el = returnTo.current;
      requestAnimationFrame(() => (el instanceof HTMLElement && el.isConnected ? el : null)?.focus());
    }
    setOpenState(next);
  };

  useEffect(() => {
    const onToggle = () => setOpen(!openRef.current);
    window.addEventListener('command-menu-toggle', onToggle);
    return () => window.removeEventListener('command-menu-toggle', onToggle);
  }, []);

  useEffect(() => {
    if (!open) return;
    setTheme(currentTheme());
    // Radix's aria-hidden pass skips ancestors of <script>, and Astro renders component scripts inside the shell,
    // so make the page behind the palette inert explicitly.
    const shell = document.querySelector('.pr-shell');
    shell?.setAttribute('inert', '');
    return () => shell?.removeAttribute('inert');
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    window.location.href = href;
  };

  return (
    // Radix Dialog (via cmdk) traps focus, closes on Esc or a click outside, and returns focus to the trigger.
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      loop
      label="Jump to"
      className="pr-palette"
      overlayClassName="pr-palette-backdrop"
      contentClassName="pr-palette-content"
    >
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
    </Command.Dialog>
  );
};
