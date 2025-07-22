# 🔧 Technical Specifications

## 📱 Platform Requirements

### Target Devices
- **Primary**: iPhone 16 Pro Max
- **Supported**: iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15, iPhone 14 Pro Max, iPhone 14 Pro, iPhone 14
- **Minimum iOS**: 15.0
- **Recommended iOS**: 18.5+

### Development Environment
- **Xcode**: 16.0+
- **Node.js**: 18.0+
- **Expo CLI**: Latest
- **TypeScript**: 5.8+
- **React Native**: 0.79.1

## 🏗️ Architecture Overview

### Frontend Architecture
```
React Native + Expo
├── Navigation: Expo Router
├── State Management: Zustand
├── UI Components: Custom + Expo
├── Animations: React Native Reanimated
├── Styling: StyleSheet + Responsive Design
└── Type Safety: TypeScript
```

### Backend Architecture
```
Supabase Backend
├── Database: PostgreSQL
├── Authentication: Supabase Auth
├── Storage: Supabase Storage
├── Edge Functions: Deno Runtime
├── Real-time: WebSocket Subscriptions
└── Security: Row Level Security (RLS)
```

### External Integrations
```
Third-Party Services
├── Stripe: Payment Processing
├── Pokemon TCG API: Card Data
├── Supabase: Backend Services
└── Expo Services: Development & Distribution
```

## 🗄️ Database Schema

### Core Tables

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  display_name TEXT,
  profile_image_url TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### cards
```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  game TEXT NOT NULL,
  rarity TEXT NOT NULL,
  set TEXT NOT NULL,
  collection_number TEXT NOT NULL,
  value DECIMAL(10,2),
  is_holographic BOOLEAN DEFAULT FALSE,
  is_reverse_holo BOOLEAN DEFAULT FALSE,
  is_secret_rare BOOLEAN DEFAULT FALSE,
  acquired_date TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### collections
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### card_gradings
```sql
CREATE TABLE card_gradings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  overall_grade DECIMAL(3,1) NOT NULL,
  centering DECIMAL(3,1) NOT NULL,
  corners DECIMAL(3,1) NOT NULL,
  edges DECIMAL(3,1) NOT NULL,
  surface DECIMAL(3,1) NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  grading_company TEXT NOT NULL,
  verification_id TEXT NOT NULL,
  flaws JSONB,
  date_graded TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### stripe_customers
```sql
CREATE TABLE stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### stripe_subscriptions
```sql
CREATE TABLE stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Security Policies (RLS)

#### profiles
```sql
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### cards
```sql
-- Users can only access their own cards
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON cards
  FOR DELETE USING (auth.uid() = user_id);
```

## 🔌 API Integrations

### Pokemon TCG API
```typescript
Base URL: https://api.pokemontcg.io/v2
Authentication: API Key (optional)
Rate Limits: 1000 requests/hour

Endpoints:
- GET /cards - Search cards
- GET /cards/{id} - Get card details
- GET /sets - Get all sets
- GET /sets/{id} - Get set details
```

### Stripe API
```typescript
Base URL: https://api.stripe.com/v1
Authentication: Secret Key
Webhooks: Required for subscription updates

Key Operations:
- Create Customer
- Create Subscription
- Handle Webhooks
- Manage Payment Methods
```

### Supabase Edge Functions
```typescript
Base URL: {SUPABASE_URL}/functions/v1
Authentication: JWT Token

Functions:
- stripe-checkout: Create checkout sessions
- stripe-webhook: Handle Stripe webhooks
```

## 🎨 UI/UX Specifications

### Design System
```typescript
Colors:
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Accent: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Warning: #F59E0B (Amber)
- Success: #10B981 (Green)

Typography:
- Headings: System Bold
- Body: System Regular
- Captions: System Medium

Spacing:
- Base Unit: 4px
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px
```

### Responsive Design
```typescript
Breakpoints:
- Small: < 375px (iPhone SE)
- Medium: 375px - 414px (Standard iPhones)
- Large: > 414px (Plus/Pro Max models)

Layout:
- Grid System: Flexbox-based
- Safe Areas: Respected on all devices
- Dynamic Type: Supported
- Dark Mode: Full support
```

## 🔒 Security Specifications

### Authentication
```typescript
Provider: Supabase Auth
Methods:
- Email/Password
- OAuth (future)
- Guest Mode (limited features)

Security Features:
- JWT Tokens
- Automatic token refresh
- Secure session management
- Password strength validation
```

### Data Protection
```typescript
Encryption:
- Data at Rest: AES-256
- Data in Transit: TLS 1.3
- Local Storage: Encrypted

Privacy:
- GDPR Compliant
- Data minimization
- User consent management
- Right to deletion
```

### Payment Security
```typescript
PCI DSS Compliance: Stripe handles all card data
Security Features:
- Tokenized payments
- 3D Secure support
- Fraud detection
- Secure webhooks
```

## 📊 Performance Specifications

### Target Metrics
```typescript
Performance Targets:
- App Launch: < 3 seconds
- Screen Transitions: < 300ms
- API Responses: < 2 seconds
- Image Loading: < 1 second
- Memory Usage: < 200MB
- Battery Impact: Minimal

Optimization Strategies:
- Image caching and compression
- Lazy loading for lists
- Efficient state management
- Background task optimization
- Network request batching
```

### Monitoring
```typescript
Analytics:
- User engagement tracking
- Feature usage metrics
- Performance monitoring
- Crash reporting
- Error tracking

Tools:
- Expo Analytics
- Supabase Analytics
- Custom event tracking
- Real-time monitoring
```

## 🧪 Testing Specifications

### Test Coverage
```typescript
Unit Tests:
- Services: 90%+ coverage
- Utilities: 95%+ coverage
- Components: 80%+ coverage

Integration Tests:
- API endpoints
- Database operations
- Authentication flows
- Payment processing

E2E Tests:
- Critical user journeys
- Subscription flows
- Core feature testing
```

### Testing Tools
```typescript
Framework: Jest + React Native Testing Library
Mocking: Jest mocks for external services
CI/CD: GitHub Actions
Device Testing: Expo Go + Physical devices
```

## 🚀 Deployment Specifications

### Build Configuration
```typescript
Expo Configuration:
- Runtime Version: 1.0.0
- Update Channel: production
- Bundle Identifier: com.decklab.tcg
- Version: 1.0.0

Build Profiles:
- Development: Local testing
- Preview: Internal testing
- Production: App Store release
```

### Environment Variables
```typescript
Required Variables:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY
- EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
- EXPO_PUBLIC_POKEMON_TCG_API_KEY

Security:
- No secrets in client code
- Environment-specific configs
- Secure key management
```

### Release Process
```typescript
Steps:
1. Code review and testing
2. Version bump and changelog
3. Build generation (EAS)
4. Internal testing
5. App Store submission
6. Production deployment

Rollback Plan:
- Previous version available
- Database migration rollback
- Feature flag toggles
- Emergency hotfix process
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready