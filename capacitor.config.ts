import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'MediAlert',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_name',
      iconColor: '#488AFF',
      sound: 'beep.wav',
    },
    SplashScreen: {
      launchShowDuration: 3000, // Duration in milliseconds
      launchAutoHide: true,    // Automatically hide after the duration
      backgroundColor: "#ffffff", // Splash background color in hex
      androidScaleType: "CENTER_CROP", // Scale type for Android
      showSpinner: false,       // Hide spinner
    },
  },
};

export default config;
