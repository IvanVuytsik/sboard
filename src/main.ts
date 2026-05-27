import { bootstrap } from './app/bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting bootstrap...');
  bootstrap().catch(error => {
    console.error('Failed to bootstrap application:', error);
  });
});
