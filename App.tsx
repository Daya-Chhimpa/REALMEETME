/**
 * RealMeet - Find Your Spot
 * A modern friendship and dating app
 *
 * @format
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { useAppDispatch, useAppSelector } from './src/redux/hooks';
import { initializeAuth, loadRegistrationDraft } from './src/redux/slices/authSlice';
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
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import {
  NavigationProvider,
  useNavigation,
  Screen
} from './src/navigation/NavigationContext';
import { colors } from './src/theme/colors';

function AppNavigator(): React.JSX.Element {
  const { currentScreen, reset } = useNavigation();
  const dispatch = useAppDispatch();
  const { isInitialized, token, registrationDraft } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(loadRegistrationDraft());
  }, [dispatch]);

  // Determine the correct startup screen based on state
  useEffect(() => {
    if (isInitialized) {
      if (token) {
        reset('matches');
      } else {
        // If not logged in, check draft to resume registration
        const nextScreen = getRegistrationNextStep(registrationDraft);
        // Only redirect if we are currently at 'welcome' (default) to avoid overriding user navigation during use
        // But on cold start, currentScreen is 'welcome'.
        // If user explicitly logs out, token is null, draft empty -> welcome.

        // We only want to auto-navigate if the computed next screen is NOT welcome, 
        // meaning they have some progress.
        if (nextScreen !== 'welcome') {
          reset(nextScreen);
        }
      }
    }
  }, [isInitialized, token, registrationDraft]); // removed registrationDraft from deps to avoid loop? No, draft changes only on save.

  const getRegistrationNextStep = (draft: any): Screen => {
    // If no mobile number, start at welcome
    if (!draft.mobile) return 'welcome';

    // If mobile but not verified -> OTP
    // We added otpVerified to draft in verifyOtp action
    if (!draft.otpVerified) return 'otp';

    // Flow: Name -> Gender -> Birthday -> Relationship -> LookingFor -> Interests -> Photos -> Password
    if (!draft.name) return 'name';
    if (!draft.gender) return 'gender';
    if (!draft.dob) return 'birthday';
    if (!draft.relationshipStatus) return 'relationship';
    if (!draft.lookingFor) return 'lookingfor';
    // interests is optional-ish but screen exists. If it's missing, go there.
    // If user skipped it, we should probably save empty array to mark it done? 
    // Current implementation of InterestsScreen saves array (empty if skipped).
    // So if interests undefined -> Interests.
    if (!draft.interests) return 'interests';

    // Photos - array exists?
    if (!draft.images || draft.images.length === 0) return 'photos';

    // Password - last step
    return 'password';
  };

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

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
      case 'forgotrequest':
        return <ForgotPasswordScreen />;
      case 'forgotreset':
        return <ResetPasswordScreen />;
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
