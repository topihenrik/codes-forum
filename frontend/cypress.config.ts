import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        'delete:db': () => {
          return fetch('http://localhost:4000/api/test/db/delete', { method: 'POST' });
        }
      })
    },
    supportFile: false,
    baseUrl: 'http://localhost:4173/'
  },
});
