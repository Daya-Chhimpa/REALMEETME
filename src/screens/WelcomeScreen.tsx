import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';
import {useNavigation} from '../navigation/NavigationContext';

const {width, height} = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const {navigate} = useNavigation();

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartGlow = useRef(new Animated.Value(0)).current;
  const leftCardAnim = useRef(new Animated.Value(-100)).current;
  const rightCardAnim = useRef(new Animated.Value(100)).current;
  const cardRotateLeft = useRef(new Animated.Value(0)).current;
  const cardRotateRight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      // Cards slide in
      Animated.parallel([
        Animated.spring(leftCardAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(rightCardAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(cardRotateLeft, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(cardRotateRight, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Heart pops in
      Animated.spring(heartScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      // Text fades in
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Heart glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartGlow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(heartGlow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleGetStarted = () => {
    navigate('mobile');
  };

  const handleLogin = () => {
    navigate('login');
  };

  // Interpolations
  const glowOpacity = heartGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  const leftRotate = cardRotateLeft.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-12deg'],
  });

  const rightRotate = cardRotateRight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '12deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      {/* Background Gradient */}
      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.backgroundGradient}
      />

      {/* Ambient Glow Effects */}
      <View style={styles.ambientGlow1} />
      <View style={styles.ambientGlow2} />
      <View style={styles.ambientGlow3} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Profile Cards Section */}
          <View style={styles.cardsSection}>
            {/* Woman Card - Left */}
            <Animated.View
              style={[
                styles.profileCard,
                styles.leftCard,
                {
                  transform: [
                    {translateX: leftCardAnim},
                    {rotate: leftRotate},
                  ],
                },
              ]}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=faces',
                }}
                style={styles.profileImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardOverlay}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>Sophie, 24</Text>
                  <View style={styles.cardLocation}>
                    <Text style={styles.locationDot}>●</Text>
                    <Text style={styles.locationText}>Online now</Text>
                  </View>
                </View>
              </LinearGradient>
              {/* Like Badge */}
              <View style={styles.likeBadge}>
                <LinearGradient
                  colors={colors.gradient.primary as [string, string]}
                  style={styles.likeBadgeGradient}>
                  <Text style={styles.likeBadgeIcon}>♥</Text>
                </LinearGradient>
              </View>
            </Animated.View>

            {/* Man Card - Right */}
            <Animated.View
              style={[
                styles.profileCard,
                styles.rightCard,
                {
                  transform: [
                    {translateX: rightCardAnim},
                    {rotate: rightRotate},
                  ],
                },
              ]}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=faces',
                }}
                style={styles.profileImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardOverlay}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>James, 28</Text>
                  <View style={styles.cardLocation}>
                    <Text style={styles.locationDot}>●</Text>
                    <Text style={styles.locationText}>2 km away</Text>
                  </View>
                </View>
              </LinearGradient>
              {/* Verified Badge */}
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            </Animated.View>

            {/* Heart Logo - Center Overlap */}
            <Animated.View
              style={[
                styles.heartWrapper,
                {transform: [{scale: heartScale}]},
              ]}>
              {/* Glow Effects */}
              <Animated.View style={[styles.heartGlowOuter, {opacity: glowOpacity}]} />
              <Animated.View style={[styles.heartGlowInner, {opacity: glowOpacity}]} />

              {/* Heart */}
              <View style={styles.heartContainer}>
                <LinearGradient
                  colors={[
                    colors.brand.primary,
                    '#FF8E72',
                    colors.brand.accent,
                  ]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.heartGradient}>
                  <Text style={styles.heartIcon}>♥</Text>
                </LinearGradient>
              </View>
            </Animated.View>
          </View>

          {/* Text Section */}
          <Animated.View
            style={[
              styles.textSection,
              {
                opacity: fadeIn,
                transform: [{translateY: slideUp}],
              },
            ]}>
            {/* App Name - Split Style */}
            <View style={styles.appNameContainer}>
              {/* Glow behind text */}
              <View style={styles.appNameGlowOuter} />
              <View style={styles.appNameGlowInner} />

              <View style={styles.appNameRow}>
                <Text style={styles.appNameReal}>Real</Text>
                <LinearGradient
                  colors={[colors.brand.primary, '#FF8E72', colors.brand.accent]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.appNameMeetGradient}>
                  <Text style={styles.appNameMeet}>Meet</Text>
                </LinearGradient>
              </View>

              {/* Sparkle decorations */}
              <Text style={styles.sparkleLeft}>✦</Text>
              <Text style={styles.sparkleRight}>✦</Text>
            </View>

            {/* Tagline */}
            <Text style={styles.tagline}>Find Your Perfect Match</Text>
            <Text style={styles.subtitle}>
              Connect with amazing people near you.{'\n'}Your love story starts here.
            </Text>
          </Animated.View>

          {/* Buttons Section */}
          <Animated.View
            style={[
              styles.bottomSection,
              {
                opacity: fadeIn,
                transform: [{translateY: slideUp}],
              },
            ]}>
            {/* Get Started Button */}
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              activeOpacity={0.9}>
              <LinearGradient
                colors={colors.gradient.primary as [string, string]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.getStartedGradient}>
                <Text style={styles.getStartedText}>Get Started</Text>
                <Text style={styles.arrowIcon}>→</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const CARD_WIDTH = width * 0.42;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  // Ambient Glow Effects
  ambientGlow1: {
    position: 'absolute',
    top: height * 0.1,
    left: -width * 0.2,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: colors.brand.primaryMuted,
    opacity: 0.5,
  },
  ambientGlow2: {
    position: 'absolute',
    top: height * 0.15,
    right: -width * 0.2,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: colors.brand.accentMuted,
    opacity: 0.4,
  },
  ambientGlow3: {
    position: 'absolute',
    bottom: height * 0.15,
    left: width * 0.2,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: colors.brand.primaryMuted,
    opacity: 0.3,
  },

  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },

  // Cards Section
  cardsSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Profile Cards
  profileCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: borderRadius.cardLarge,
    overflow: 'hidden',
    position: 'absolute',
    ...shadows.xl,
  },
  leftCard: {
    left: spacing[2],
    top: spacing[4],
    zIndex: 1,
  },
  rightCard: {
    right: spacing[2],
    top: spacing[4],
    zIndex: 1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing[10],
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[3],
  },
  cardInfo: {},
  cardName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
    gap: spacing[1],
  },
  locationDot: {
    fontSize: 8,
    color: colors.accent.green,
  },
  locationText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },

  // Like Badge
  likeBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    ...shadows.primaryGlow,
  },
  likeBadgeGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeBadgeIcon: {
    fontSize: 18,
    color: colors.text.primary,
  },

  // Verified Badge
  verifiedBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  verifiedIcon: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },

  // Heart Wrapper - Center
  heartWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heartGlowOuter: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.ui.shadowPrimary,
  },
  heartGlowInner: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.brand.primaryMuted,
  },
  heartContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.background.primary,
    ...shadows.primaryGlow,
  },
  heartGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 40,
    color: colors.text.primary,
    marginTop: -4,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },

  // Text Section
  textSection: {
    alignItems: 'center',
    marginTop: spacing[6],
    marginBottom: spacing[4],
  },
  appNameContainer: {
    marginBottom: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  appNameGlowOuter: {
    position: 'absolute',
    width: 200,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.brand.primaryMuted,
    opacity: 0.6,
  },
  appNameGlowInner: {
    position: 'absolute',
    width: 160,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.ui.shadowPrimary,
    opacity: 0.4,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appNameReal: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  appNameMeetGradient: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
    marginLeft: spacing[1],
  },
  appNameMeet: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 107, 138, 0.8)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  sparkleLeft: {
    position: 'absolute',
    left: -20,
    top: -5,
    fontSize: 14,
    color: colors.brand.primary,
    opacity: 0.8,
  },
  sparkleRight: {
    position: 'absolute',
    right: -20,
    bottom: -5,
    fontSize: 14,
    color: colors.brand.accent,
    opacity: 0.8,
  },
  tagline: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Bottom Section
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },

  // Get Started Button
  getStartedButton: {
    width: '100%',
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    marginBottom: spacing[5],
    ...shadows.primaryGlow,
  },
  getStartedGradient: {
    flexDirection: 'row',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  getStartedText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  arrowIcon: {
    fontSize: typography.size.xl,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },

  // Login Container
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },
  loginLink: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },
});
