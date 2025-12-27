/**
 * RealMeet - Find Your Spot
 * A modern friendship and dating app
 *
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { MobileNumberScreen } from './src/screens/MobileNumberScreen';
import { OTPVerificationScreen } from './src/screens/OTPVerificationScreen';
import { NameScreen } from './src/screens/NameScreen';
import { GenderScreen } from './src/screens/GenderScreen';
import { BirthdayScreen } from './src/screens/BirthdayScreen';
import { RelationshipStatusScreen } from './src/screens/RelationshipStatusScreen';
import { LookingForScreen } from './src/screens/LookingForScreen';
import { PhotoUploadScreen } from './src/screens/PhotoUploadScreen';
import { InterestsScreen } from './src/screens/InterestsScreen';
import { PasswordScreen } from './src/screens/PasswordScreen';
import { MatchesScreen } from './src/screens/MatchesScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { VisitorsScreen } from './src/screens/VisitorsScreen';
import { LikesYouScreen } from './src/screens/LikesYouScreen';
import { NewAndOnlineScreen } from './src/screens/NewAndOnlineScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { ProfileDetailScreen } from './src/screens/ProfileDetailScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { PremiumScreen } from './src/screens/PremiumScreen';
import { HelpSupportScreen } from './src/screens/HelpSupportScreen';
import {
  NavigationProvider,
  useNavigation,
} from './src/navigation/NavigationContext';

function AppNavigator(): React.JSX.Element {
  const { currentScreen } = useNavigation();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'mobile':
        return <MobileNumberScreen />;
      case 'otp':
        return <OTPVerificationScreen />;
      case 'name':
        return <NameScreen />;
      case 'gender':
        return <GenderScreen />;
      case 'birthday':
        return <BirthdayScreen />;
      case 'relationship':
        return <RelationshipStatusScreen />;
      case 'lookingfor':
        return <LookingForScreen />;
      case 'interests':
        return <InterestsScreen />;
      case 'photos':
        return <PhotoUploadScreen />;
      case 'password':
        return <PasswordScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'login':
        return <LoginScreen />;
      case 'visitors':
        return <VisitorsScreen />;
      case 'likesyou':
        return <LikesYouScreen />;
      case 'newonline':
        return <NewAndOnlineScreen />;
      case 'search':
        return <SearchScreen />;
      case 'profiledetail':
        return <ProfileDetailScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'editprofile':
        return <EditProfileScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'premium':
        return <PremiumScreen />;
      case 'help':
        return <HelpSupportScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return renderScreen();
}

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationProvider>
        <AppNavigator />
      </NavigationProvider>
    </Provider>
  );
}

export default App;
