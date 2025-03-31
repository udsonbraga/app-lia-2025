
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.safe.lady',
  appName: 'Safe Lady',
  webDir: 'dist',
  server: {
    url: 'https://b130c587-50fa-4315-ac71-dc0833a85f2c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {}
  }
};

export default config;
