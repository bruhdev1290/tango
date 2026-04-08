import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.taiga.mobile',
  appName: 'Taiga Mobile',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#3F51B5',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#FFFFFF'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#3F51B5'
    }
  }
};

export default config;
