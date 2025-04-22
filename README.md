# REKRO Social Networking Application

REKRO is a mobile application focused on social interactions, enabling users to connect, share activities, and engage in real-time conversations. Developed with React Native and Expo, it offers cross-platform compatibility for both iOS and Android devices.

## Application Overview

REKRO bridges social gaps by creating platforms for users to discover events, connect with like-minded individuals, and build meaningful relationships through intuitive digital interactions.

### Core Features

- **User Authentication System**
  - Secure registration and login process
  - Password recovery functionality
  - Multi-factor authentication options
  - Session management and token-based authentication
  - Profile setup with customizable fields

- **Home Feed**
  - Personalized activity recommendations based on user preferences
  - Potential social connections suggested by algorithm
  - Real-time updates for friend activities
  - Customizable feed filtering options
  - Pull-to-refresh and infinite scrolling implementation

- **Event Discovery & Participation**
  - Browse events by category, location, or date
  - Detailed event information including description, attendees, and location
  - RSVP functionality with calendar integration
  - Event creation and management for hosts
  - Rating and review system for past events
  - Location-based event suggestions with map integration

- **Social Connections**
  - Friend request system with notifications
  - User profile viewing with activity history
  - Connection recommendations based on mutual interests
  - Block and report functionality for user safety
  - Privacy controls for sharing information

- **Real-time Chat**
  - Private conversations with contacts using WebSockets
  - Media sharing capabilities (images, documents)
  - Read receipts and typing indicators
  - Message search functionality
  - Push notifications for new messages
  - Offline message queuing

- **Profile Management**
  - View and edit personal information
  - Manage followers and following lists
  - Privacy settings configuration
  - Activity history and statistics
  - Customizable profile themes

### Technical Features

- State management with MobX for efficient UI updates
- Seamless navigation with React Navigation
- Real-time data communication via WebSockets
- Responsive UI design adapting to various screen sizes
- Offline data persistence with AsyncStorage
- Type-safe development using TypeScript
- Performance optimizations for smooth user experience

## Project Structure

```
├── src/                  # Source code directory
│   ├── assets/           # Images and static resources
│   │   ├── images/       # Application images and icons
│   │   ├── fonts/        # Custom font files
│   │   └── animations/   # Lottie animation files
│   │
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared components (buttons, inputs, etc.)
│   │   ├── forms/        # Form-related components
│   │   ├── layout/       # Layout components
│   │   └── modals/       # Modal dialogs
│   │
│   ├── hooks/            # Custom React Hooks
│   │   ├── useAuth.ts    # Authentication hooks
│   │   ├── useSocket.ts  # WebSocket connection hooks
│   │   └── useTheme.ts   # Theme management hooks
│   │
│   ├── screens/          # Application screen components
│   │   ├── auth/         # Authentication-related screens
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   │
│   │   ├── connections/  # Social connection features
│   │   │   ├── FriendList.tsx
│   │   │   ├── FriendRequests.tsx
│   │   │   └── PeopleSearch.tsx
│   │   │
│   │   ├── conversations/# Chat conversation features
│   │   │   ├── ChatList.tsx
│   │   │   ├── ChatRoom.tsx
│   │   │   └── MessageComposer.tsx
│   │   │
│   │   ├── events/       # Event-related features
│   │   │   ├── EventList.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   └── EventCreation.tsx
│   │   │
│   │   ├── home/         # Home screen
│   │   │   ├── HomeFeed.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── ActivityFeed.tsx
│   │   │
│   │   └── profile/      # User profile screens
│   │       ├── UserProfile.tsx
│   │       ├── EditProfile.tsx
│   │       └── Settings.tsx
│   │
│   ├── services/         # API services and data access
│   │   ├── api/          # API client configuration
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   │
│   │   ├── auth/         # Authentication services
│   │   ├── events/       # Event-related services
│   │   ├── chat/         # Chat-related services
│   │   └── users/        # User-related services
│   │
│   ├── stores/           # MobX state stores
│   │   ├── authStore.ts
│   │   ├── eventStore.ts
│   │   ├── chatStore.ts
│   │   └── rootStore.ts
│   │
│   ├── navigation/       # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   │
│   ├── styles/           # Shared styles
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── theme.ts
│   │
│   ├── utils/            # Utility functions
│   │   ├── datetime.ts
│   │   ├── validation.ts
│   │   └── storage.ts
│   │
│   └── types/            # TypeScript type definitions
│       ├── auth.types.ts
│       ├── event.types.ts
│       ├── user.types.ts
│       └── chat.types.ts
│
├── App.tsx               # Application entry component
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Technology Stack

- **Frontend Framework**: React Native (v0.76.9)
  - Cross-platform mobile application development
  - Native performance with JavaScript/TypeScript

- **UI Library**: React Native components
  - Custom styled components for consistent UI
  - Animation libraries for enhanced UX

- **State Management**: MobX (v6.13.6)
  - Observable state management pattern
  - Efficient rendering with computed values
  - Action-based state mutations

- **Navigation**: React Navigation (v7.x)
  - Stack, Tab, and Drawer navigation options
  - Screen transition animations
  - Deep linking support

- **HTTP Client**: Axios (v1.7.9)
  - Promise-based HTTP client
  - Request/response interceptors
  - Automatic JSON transformation

- **Data Storage**: AsyncStorage
  - Persistent key-value storage
  - Data caching mechanisms
  - Encrypted storage for sensitive information

- **Real-time Communication**: WebSocket (sockjs-client)
  - Bidirectional communication channel
  - Real-time updates and notifications
  - Connection management with auto-reconnect

- **Development Environment**: Expo (v52.0.46)
  - Simplified React Native workflow
  - Access to device APIs
  - Over-the-air updates

- **Testing Framework**:
  - Jest for unit and integration tests
  - Detox for end-to-end testing
  - React Native Testing Library for component tests

## Installation and Setup

### Prerequisites

- Node.js (>=18)
- Yarn or npm package manager
- iOS/Android simulator or physical device for testing
- Expo CLI (`npm install -g expo-cli`)

### Installation Steps

1. Clone the repository
   ```bash
   git clone [repository-url]
   cd my-app
   ```

2. Install dependencies
   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

4. Start the development server
   ```bash
   yarn start
   # or
   npm start
   ```

5. Run the application
   - Press `i` to run on iOS simulator
   - Press `a` to run on Android simulator
   - Scan the QR code with the Expo Go app on your device

### Troubleshooting

- If you encounter package resolution issues, try clearing the cache:
  ```bash
  expo start -c
  ```

- For iOS build issues, ensure Xcode and CocoaPods are properly installed:
  ```bash
  sudo gem install cocoapods
  cd ios && pod install
  ```

- For Android build issues, verify that Android SDK is properly configured in your environment variables

## Application Navigation Structure

The application implements a nested navigation structure:

1. **Root Navigator**:
   - Controls authentication flow
   - Handles deep linking

2. **Authentication Stack Navigator**:
   - Login Screen
   - Registration Screen
   - Forgot Password Screen
   - Profile Setup Screen

3. **Main Tab Navigator**:
   - Home Tab
     - Home Feed Screen
     - Search Screen
   - Events Tab
     - Events List Screen
     - Event Details Screen
     - Event Creation Screen
   - Connections Tab
     - Friend List Screen
     - Friend Requests Screen
     - People Discovery Screen
   - Chat Tab
     - Conversations List Screen
     - Chat Room Screen
   - Profile Tab
     - User Profile Screen
     - Settings Screen
     - Account Management Screen

4. **Modal Stack Navigator**:
   - Notification Modal
   - Photo Viewer Modal
   - Share Content Modal

## Development Guidelines

### Code Style and Standards

The project uses ESLint for code quality checking and TypeScript for type checking. We follow a consistent coding style across the codebase:

- Use functional components with hooks
- Implement proper type definitions
- Follow the container/presenter pattern
- Maintain meaningful component naming conventions
- Write comprehensive comments for complex logic

### Environment Configuration

The application supports multiple environments:

- **Development**: Points to development API endpoints
- **Staging**: Points to staging environment for testing
- **Production**: Uses production API endpoints

Configure environment-specific variables in the appropriate `.env` files.

### Adding New Features

1. Create new components in the appropriate directory
   - Place reusable components in `src/components`
   - Screen components go in `src/screens`

2. Add new screens to the navigation stack
   - Update the appropriate navigator in `src/navigation`
   - Configure screen options as needed

3. Add new API services
   - Create service files in `src/services`
   - Implement proper error handling and retries

4. Update state management
   - Add new stores or update existing ones in `src/stores`
   - Follow MobX best practices for observables and actions

### Data Flow Architecture

1. **Store Layer**:
   - MobX stores manage application state
   - Stores provide actions for state mutations
   - Computed values derive complex state

2. **Service Layer**:
   - API communication handled by services
   - Services transform data between API and application formats
   - Error handling and retry logic implemented here

3. **Component Layer**:
   - Components connect to stores via hooks
   - Presentational components receive data via props
   - User interactions trigger store actions

### Performance Optimization Techniques

- Implement virtualized lists for long scrolling content
- Use memo and useCallback to prevent unnecessary re-renders
- Optimize images for mobile devices
- Implement proper loading states and skeleton screens
- Use lazy loading for non-critical components

## Testing Strategy

### Unit Testing

Unit tests focus on testing individual components and functions in isolation:

```bash
# Run unit tests
yarn test
```

### Integration Testing

Integration tests verify that different parts of the application work together correctly:

```bash
# Run integration tests
yarn test:integration
```

### End-to-End Testing

E2E tests simulate user interactions to test complete workflows:

```bash
# Run E2E tests
yarn test:e2e
```

## Deployment

### Building for Production

```bash
# Build for Android
eas build -p android

# Build for iOS
eas build -p ios
```

### Publishing Updates

```bash
# Publish an update to existing builds
eas update --branch production
```

### App Store Submission

1. Generate production build
2. Create app listings in App Store Connect and Google Play Console
3. Upload builds using EAS Submit:
   ```bash
   eas submit -p ios
   eas submit -p android
   ```

## Monitoring and Analytics

The application integrates with monitoring and analytics tools:

- **Error Tracking**: Sentry for real-time error monitoring
- **Usage Analytics**: Firebase Analytics for user behavior insights
- **Performance Monitoring**: Firebase Performance for tracking app performance

## Contribution Guidelines

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code adheres to our style guidelines and passes all tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [MobX](https://mobx.js.org/)
- [React Navigation](https://reactnavigation.org/) 