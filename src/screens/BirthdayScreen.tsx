import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { colors, shadows, borderRadius } from '../theme/colors';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Generate Arrays
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  { label: 'Jan', value: '01' },
  { label: 'Feb', value: '02' },
  { label: 'Mar', value: '03' },
  { label: 'Apr', value: '04' },
  { label: 'May', value: '05' },
  { label: 'Jun', value: '06' },
  { label: 'Jul', value: '07' },
  { label: 'Aug', value: '08' },
  { label: 'Sep', value: '09' },
  { label: 'Oct', value: '10' },
  { label: 'Nov', value: '11' },
  { label: 'Dec', value: '12' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: (currentYear - 13) - 1970 + 1 }, (_, i) => String(currentYear - 13 - i)); // 13+ age restriction, descending

interface DropdownProps {
  label: string;
  value: string;
  options: any[];
  onSelect: (val: string) => void;
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, options, onSelect, placeholder }) => {
  const [visible, setVisible] = useState(false);

  const getLabel = (val: string) => {
    if (!val) return placeholder;
    const option = options.find(o => (typeof o === 'string' ? o : o.value) === val);
    if (!option) return val;
    return typeof option === 'string' ? option : option.label;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {getLabel(value)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select {label}</Text>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => (typeof item === 'string' ? item : item.value)}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const itemValue = typeof item === 'string' ? item : item.value;
                    const itemLabel = typeof item === 'string' ? item : item.label;
                    const isSelected = itemValue === value;

                    return (
                      <TouchableOpacity
                        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                        onPress={() => {
                          onSelect(itemValue);
                          setVisible(false);
                        }}
                      >
                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                          {itemLabel}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export const BirthdayScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft } = useAppSelector(state => state.auth);

  // Initialize from draft if available
  const initialDob = registrationDraft.dob ? registrationDraft.dob.split('-') : ['', '', ''];
  const [birthday, setBirthday] = useState({
    day: initialDob[2] || '',
    month: initialDob[1] || '',
    year: initialDob[0] || '',
  });

  const handleNext = async () => {
    if (isValid) {
      const formattedDob = `${birthday.year}-${birthday.month}-${birthday.day}`;
      await dispatch(saveDraft({ dob: formattedDob }));
      navigate('relationship');
    }
  };

  const isValid = birthday.day && birthday.month && birthday.year;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>When's your birthday?</Text>
          <Text style={styles.subtitle}>Your age will be public</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.birthdayContainer}>
            <View style={[styles.inputWrapper, { flex: 0.8 }]}>
              <Dropdown
                label="Day"
                value={birthday.day}
                placeholder="DD"
                options={DAYS}
                onSelect={(val) => setBirthday({ ...birthday, day: val })}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: 1.2 }]}>
              <Dropdown
                label="Month"
                value={birthday.month}
                placeholder="Month"
                options={MONTHS}
                onSelect={(val) => setBirthday({ ...birthday, month: val })}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Dropdown
                label="Year"
                value={birthday.year}
                placeholder="Year"
                options={YEARS}
                onSelect={(val) => setBirthday({ ...birthday, year: val })}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
          activeOpacity={0.8}>
          <LinearGradient
            colors={
              isValid
                ? (colors.gradient.primary as [string, string])
                : [colors.ui.borderDark, colors.ui.borderDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  formContainer: {
    flex: 1,
  },
  birthdayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  inputWrapper: {
    // flex handled inline
  },
  // Dropdown Styles
  dropdownButton: {
    backgroundColor: colors.background.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.border,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  placeholderText: {
    color: colors.text.tertiary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.5,
    padding: 24,
  },
  modalHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  optionItemSelected: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  optionText: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 56,
    ...shadows.primaryGlow,
  },
  nextButtonGradient: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 1,
  },
});
