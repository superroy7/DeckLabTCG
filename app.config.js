import 'dotenv/config';

export default {
  expo: {
    name: 'DeckLab TCG',
    slug: 'decklab-tcg',
    version: '1.0.0',
    runtimeVersion: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'decklab',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    description: 'The ultimate Pokemon TCG companion app with AI grading, market intelligence, and collection management. Features include CertiGrade AI grading, real-time market data, virtual vault pack opening, and comprehensive collection management.',
    keywords: ['pokemon', 'tcg', 'trading cards', 'collection', 'grading', 'marketplace'],
    primaryColor: '#3B82F6',
    backgroundColor: '#000000',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.decklab.tcg',
      buildNumber: '1',
      infoPlist: {
        NSCameraUsageDescription: 'DeckLab needs camera access to scan and grade your Pokemon cards using AI technology.',
        NSPhotoLibraryUsageDescription: 'DeckLab needs photo library access to save and manage your card images.',
        NSMicrophoneUsageDescription: 'DeckLab may use microphone for enhanced AR experiences.',
        NSLocationWhenInUseUsageDescription: 'DeckLab uses location to find local card shops and events near you.',
        CFBundleDisplayName: 'DeckLab TCG',
        ITSAppUsesNonExemptEncryption: false
      },
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      package: 'com.decklab.tcg',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      permissions: [
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE'
      ]
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-web-browser',
      'expo-camera',
      'expo-sensors',
      [
        '@stripe/stripe-react-native',
        {
          merchantIdentifier: 'merchant.com.decklab.tcg',
          enableGooglePay: true
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'your-eas-project-id'
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      pokemonTcgApiKey: process.env.EXPO_PUBLIC_POKEMON_TCG_API_KEY
    }
  }
};