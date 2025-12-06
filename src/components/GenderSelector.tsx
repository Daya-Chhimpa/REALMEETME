import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface GenderSelectorProps {
  selected: 'male' | 'female' | null;
  onSelect: (gender: 'male' | 'female') => void;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Almost there! Just a few quick details</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            selected === 'male' && styles.optionSelected,
          ]}
          onPress={() => onSelect('male')}
          activeOpacity={0.7}>
          <Text style={styles.emoji}>👨</Text>
          <Text
            style={[
              styles.optionText,
              selected === 'male' && styles.optionTextSelected,
            ]}>
            I'm a Man
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selected === 'female' && styles.optionSelected,
          ]}
          onPress={() => onSelect('female')}
          activeOpacity={0.7}>
          <Text style={styles.emoji}>👩</Text>
          <Text
            style={[
              styles.optionText,
              selected === 'female' && styles.optionTextSelected,
            ]}>
            I'm a Woman
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  option: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.ui.borderDark,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.ui.overlay,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
  optionTextSelected: {
    color: colors.text.primary,
    fontWeight: '600',
  },
});
