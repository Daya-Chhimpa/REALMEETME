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
import { AddressScreen } from './src/screens/AddressScreen';
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
import { ChangePasswordScreen } from './src/screens/ChangePasswordScreen';
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

  // Define screens that don't require authentication (Auth Flow)
  const authScreens: Screen[] = [
    'welcome',
    'mobile',
    'otp',
    'login',
    'signup',
    'forgotrequest',
    'forgotreset'
  ];

  // Define the ordered registration flow
  const registrationFlow: Screen[] = [
    'welcome',
    'mobile',
    'otp',
    'name',
    'gender',
    'birthday',
    'relationship',
    'lookingfor',
    'address',
    'interests',
    'photos',
    'password'
  ];

  // Determine the correct startup screen based on state
  useEffect(() => {
    if (isInitialized) {
      if (token) {
        if (authScreens.includes(currentScreen)) {
          reset('matches');
        }
      } else {
        const nextScreen = getRegistrationNextStep(registrationDraft);

        if (nextScreen === 'welcome') {
          if (authScreens.includes(currentScreen)) {
            return;
          }
        }

        // Check if current screen is part of the flow
        const currentIndex = registrationFlow.indexOf(currentScreen);
        const nextIndex = registrationFlow.indexOf(nextScreen);

        // Redirect ONLY if we are trying to access a future step (ahead of what we've completed)
        // OR if we are completely off the flow (e.g. some random screen)
        // BUT allow visiting previous steps (currentIndex < nextIndex)
        // If currentIndex is -1 (not in flow, e.g. login), and nextScreen is explicitly calculated, maybe we should redirect?
        // But 'login', 'signup', 'forgot...' are valid alternative paths.

        // If we are strictly in the "linear registration flow":
        if (currentIndex !== -1 && nextIndex !== -1) {
          // If we are ahead of where we should be, force back.
          // If we are behind (currentIndex < nextIndex), it's fine (reviewing data).
          if (currentIndex > nextIndex) {
            reset(nextScreen);
          }
          // If equal, we are fine.
          // If less, we are fine (editing previous steps).
        } else {
          // If we are not in the flow (e.g. Login screen), but Redux says we have a draft?
          // Usually we stay on Login if user chose Login.
          // If user is freshly opening app, currentScreen might be 'welcome' (default).
          // If 'welcome' (index 0) and next is 'name' (index 3), we SHOULD redirect to 'name' to resume.
          // But if user explicitly navigated to 'login', don't pull them back.

          // So, only auto-redirect if currentScreen is 'welcome' or 'mobile' (early stages) AND we have advanced state?
          // OR: rely on the fact that if user is on 'welcome', we bump them.

          if (currentScreen === 'welcome' && nextScreen !== 'welcome') {
            reset(nextScreen);
          }
        }
      }
    }
  }, [isInitialized, token, registrationDraft, currentScreen]);

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
    if (!draft.address) return 'address';
    // interests is optional-ish but screen exists. If it's missing, go there.
    // If user skipped it, we should probably save empty array to mark it done? 
    // Current implementation of InterestsScreen saves array (empty if skipped).
    // So if interests undefined -> Interests.
    if (!draft.interests) return 'interests';

    // Photos - array exists?
    if (!draft.images) return 'photos';

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
      case 'address':
        return <AddressScreen />;
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
      case 'changepassword':
        return <ChangePasswordScreen />;
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
