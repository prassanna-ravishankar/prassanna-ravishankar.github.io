import { createRoot } from 'react-dom/client';
import { CommandMenu } from './CommandMenu';

export function mountCommandMenu(el: HTMLElement) {
  createRoot(el).render(<CommandMenu initialOpen />);
}
