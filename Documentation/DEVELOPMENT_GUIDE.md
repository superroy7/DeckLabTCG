# 👨‍💻 Development Guide

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (18.0 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (Xcode) or **Android Emulator**
- **Git**

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd DeckLabTCGApp-main
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   EXPO_PUBLIC_POKEMON_TCG_API_KEY=your_pokemon_tcg_api_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
DeckLabTCGApp-main/
├── app/                    # App screens (Expo Router)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── components/            # Reusable UI components
├── services/             # API services and business logic
├── store/                # State management (Zustand)
├── types/                # TypeScript type definitions
├── lib/                  # Utilities and constants
├── hooks/                # Custom React hooks
├── supabase/             # Database migrations and functions
├── assets/               # Images, fonts, and other assets
└── Documentation/        # Project documentation
```

## 🎯 Development Workflow

### 1. Feature Development

#### Branch Naming Convention
```bash
feature/feature-name      # New features
bugfix/bug-description   # Bug fixes
hotfix/critical-fix      # Critical production fixes
refactor/component-name  # Code refactoring
```

#### Development Process
1. Create a new branch from `main`
2. Implement the feature with tests
3. Update documentation if needed
4. Create a pull request
5. Code review and approval
6. Merge to main

### 2. Code Standards

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### ESLint Rules
```json
{
  "extends": ["expo", "@expo/eslint-config-expo"],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 3. Component Development

#### Component Structure
```typescript
// components/ExampleComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExampleComponentProps {
  title: string;
  onPress?: () => void;
}

export function ExampleComponent({ title, onPress }: ExampleComponentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

#### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow naming conventions (PascalCase)
- Include proper error handling
- Add accessibility props
- Use StyleSheet for styling

### 4. State Management

#### Zustand Store Pattern
```typescript
// store/exampleStore.ts
import { create } from 'zustand';

interface ExampleState {
  items: Item[];
  isLoading: boolean;
  addItem: (item: Item) => void;
  loadItems: () => Promise<void>;
}

export const useExampleStore = create<ExampleState>((set, get) => ({
  items: [],
  isLoading: false,

  addItem: (item: Item) => {
    set(state => ({
      items: [...state.items, item],
    }));
  },

  loadItems: async () => {
    set({ isLoading: true });
    try {
      const items = await fetchItems();
      set({ items, isLoading: false });
    } catch (error) {
      console.error('Error loading items:', error);
      set({ isLoading: false });
    }
  },
}));
```

### 5. Service Development

#### Service Pattern
```typescript
// services/exampleService.ts
class ExampleService {
  private baseUrl = 'https://api.example.com';

  async fetchData(id: string): Promise<Data> {
    try {
      const response = await fetch(`${this.baseUrl}/data/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}

export const exampleService = new ExampleService();
```

## 🧪 Testing

### Unit Testing
```typescript
// __tests__/ExampleComponent.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExampleComponent } from '../components/ExampleComponent';

describe('ExampleComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ExampleComponent title="Test Title" />
    );
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('handles press events', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ExampleComponent title="Test" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🗄️ Database Development

### Supabase Setup
1. Create a new Supabase project
2. Set up authentication
3. Create database tables
4. Configure Row Level Security (RLS)
5. Set up Edge Functions

### Migration Development
```sql
-- supabase/migrations/001_initial_schema.sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

### Edge Functions
```typescript
// supabase/functions/example/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const { data } = await req.json();
    
    // Process data
    const result = processData(data);
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

## 🎨 UI/UX Development

### Design System Usage
```typescript
// Use consistent colors
import { colors } from '../lib/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text.primary,
    fontSize: 16,
  },
});
```

### Responsive Design
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width > 400 ? '80%' : '95%',
    padding: width > 400 ? 20 : 16,
  },
});
```

### Accessibility
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Add card to collection"
  accessibilityHint="Adds the selected card to your collection"
  accessibilityRole="button"
>
  <Text>Add Card</Text>
</TouchableOpacity>
```

## 🔧 Debugging

### React Native Debugger
1. Install React Native Debugger
2. Enable remote debugging in Expo
3. Use Redux DevTools for state inspection

### Flipper Integration
```bash
# Install Flipper
npm install --save-dev react-native-flipper

# Use Flipper plugins for network, database, and layout inspection
```

### Common Debugging Commands
```bash
# Clear Metro cache
npx expo start --clear

# Reset Expo cache
npx expo install --fix

# Check bundle size
npx expo export --dump-assetmap

# Analyze bundle
npx @expo/bundle-analyzer
```

## 📱 Device Testing

### iOS Simulator
```bash
# Open iOS Simulator
npx expo run:ios

# Specific simulator
npx expo run:ios --simulator="iPhone 16 Pro Max"
```

### Physical Device Testing
```bash
# Install Expo Go app on device
# Scan QR code from terminal
npm run dev
```

### TestFlight Distribution
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios
```

## 🚀 Performance Optimization

### Bundle Size Optimization
```typescript
// Use dynamic imports for large components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Optimize images
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  cachePolicy="memory-disk"
/>
```

### Memory Management
```typescript
// Cleanup subscriptions
useEffect(() => {
  const subscription = someService.subscribe(callback);
  
  return () => {
    subscription.unsubscribe();
  };
}, []);

// Optimize re-renders
const MemoizedComponent = React.memo(Component);
```

## 🔒 Security Best Practices

### Environment Variables
```typescript
// Never commit secrets to version control
// Use Expo's secure store for sensitive data
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('userToken', token);
const token = await SecureStore.getItemAsync('userToken');
```

### API Security
```typescript
// Always validate input
const validateInput = (input: string): boolean => {
  return input.length > 0 && input.length < 100;
};

// Use proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  // Don't expose internal errors to users
  throw new Error('Something went wrong');
}
```

## 📚 Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

### Tools
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
- [EAS CLI](https://docs.expo.dev/build/setup/)
- [Supabase CLI](https://supabase.com/docs/reference/cli)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

### Community
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://reactnative.dev/community/overview)
- [Supabase Discord](https://discord.supabase.com/)

---

**Happy Coding! 🚀**

Remember to follow the coding standards, write tests, and keep documentation updated. If you have questions, don't hesitate to reach out to the team.