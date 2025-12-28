import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { 
  Search, 
  FileText, 
  Code, 
  Feather, 
  Home, 
  User, 
  Github, 
  Linkedin, 
  Twitter, 
  Moon, 
  Sun,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the searchable items
const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Blog', href: '/blog/', icon: FileText },
  { name: 'Projects', href: '/projects/', icon: Code },
  { name: 'Verses', href: '/verses/', icon: Feather },
  { name: 'About', href: '/about/', icon: User },
];

const socials = [
  { name: 'GitHub', href: 'https://github.com/prassanna-ravishankar', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/prassanna-ravishankar', icon: Linkedin },
  { name: 'Twitter', href: 'https://x.com/thenomadiccoder', icon: Twitter },
];

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  // Toggle with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Theme handling
  useEffect(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme') as any);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    
    // Dispatch event for other components
    window.dispatchEvent(new Event('theme-change'));
    
    // Update theme toggle buttons if they exist
    const toggleBtn = document.querySelector('#theme-toggle');
    if (toggleBtn) toggleBtn.dispatchEvent(new Event('click')); // Hacky sync
    
    setOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 bg-surface border border-subtle/10 text-muted hover:text-main p-3 rounded-full shadow-2xl flex items-center gap-2 group transition-all hover:scale-105"
        aria-label="Open Command Menu"
      >
        <span className="text-xs font-mono hidden md:inline-block opacity-0 group-hover:opacity-100 transition-opacity absolute right-14 whitespace-nowrap bg-surface px-2 py-1 rounded border border-subtle/10">
          Cmd + K
        </span>
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-xl relative z-50"
            >
              <Command loop className="w-full bg-surface border border-subtle/10 rounded-xl shadow-2xl overflow-hidden text-main">
                <div className="flex items-center border-b border-subtle/10 px-4">
                  <Search className="w-5 h-5 text-muted mr-3" />
                  <Command.Input
                    autoFocus
                    placeholder="Type a command or search..."
                    className="w-full bg-transparent py-4 text-lg outline-none placeholder:text-muted"
                  />
                  <div className="flex items-center gap-1">
                     <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-subtle/20 bg-subtle/5 px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
                      <span className="text-xs">ESC</span>
                    </kbd>
                  </div>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-py-2">
                  <Command.Empty className="py-6 text-center text-sm text-muted">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="text-muted text-xs font-mono uppercase tracking-wider mb-2 px-2">
                    {navigation.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={item.name}
                        onSelect={() => {
                          window.location.href = item.href;
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-main hover:bg-subtle/5 hover:text-primary cursor-pointer transition-colors aria-selected:bg-subtle/5 aria-selected:text-primary"
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="flex-1 text-base">{item.name}</span>
                        <span className="text-xs text-muted font-mono opacity-50">Jump to</span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Separator className="my-2 h-px bg-subtle/10" />

                  <Command.Group heading="Socials" className="text-muted text-xs font-mono uppercase tracking-wider mb-2 px-2">
                    {socials.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={item.name}
                        onSelect={() => {
                          window.open(item.href, '_blank');
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-main hover:bg-subtle/5 hover:text-primary cursor-pointer transition-colors aria-selected:bg-subtle/5 aria-selected:text-primary"
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="flex-1 text-base">{item.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-muted" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                  
                  <Command.Separator className="my-2 h-px bg-subtle/10" />

                  <Command.Group heading="System" className="text-muted text-xs font-mono uppercase tracking-wider mb-2 px-2">
                    <Command.Item
                      value="Toggle Theme"
                      onSelect={toggleTheme}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-main hover:bg-subtle/5 hover:text-primary cursor-pointer transition-colors aria-selected:bg-subtle/5 aria-selected:text-primary"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      <span className="flex-1 text-base">Toggle Theme</span>
                      <span className="text-xs text-muted font-mono">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </Command.Item>
                  </Command.Group>

                </Command.List>
                
                <div className="border-t border-subtle/10 bg-subtle/5 px-4 py-2 flex items-center justify-between text-xs text-muted">
                    <div className="flex gap-4">
                        <span>Navigate <kbd className="font-sans">↓ ↑</kbd></span>
                        <span>Select <kbd className="font-sans">↵</kbd></span>
                    </div>
                    <span>Prassanna Ravishankar</span>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper icon
const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 17l9.2-9.2M17 17V7H7" />
  </svg>
);
