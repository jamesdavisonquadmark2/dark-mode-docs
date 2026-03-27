import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Dark Mode for Google Docs',
    description: 'A beautiful dark mode for Google Docs with multiple themes',
    version: '1.0.0',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['https://docs.google.com/*'],
    icons: {
      '16': 'assets/icon-16.png',
      '48': 'assets/icon-48.png',
      '128': 'assets/icon-128.png',
    },
    commands: {
      toggle_dark_mode: {
        suggested_key: {
          default: 'Ctrl+Shift+D',
          mac: 'Command+Shift+D',
        },
        description: 'Toggle dark mode on/off',
      },
    },
  },
});
