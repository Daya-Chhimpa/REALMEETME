import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Screen =
  | 'welcome'
  | 'mobile'
  | 'otp'
  | 'name'
  | 'gender'
  | 'birthday'
  | 'relationship'
  | 'lookingfor'
  | 'interests'
  | 'photos'
  | 'password'
  | 'matches'
  | 'signup'
  | 'login'
  | 'visitors'
  | 'likesyou'
  | 'newonline'
  | 'search'
  | 'profiledetail'
  | 'messages'
  | 'editprofile'
  | 'chat'
  | 'premium'
  | 'help';

interface NavigationContextType {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  reset: (screen: Screen) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [history, setHistory] = useState<Screen[]>(['welcome']);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setHistory(prev => [...prev, screen]);
  };

  const reset = (screen: Screen) => {
    setCurrentScreen(screen);
    setHistory([screen]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(previousScreen);
      setHistory(newHistory);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, goBack, reset }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
