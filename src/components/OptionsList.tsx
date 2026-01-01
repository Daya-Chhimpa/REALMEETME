import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface Option {
  id: string;
  label: string;
}

interface OptionsListProps {
  options: Option[];
  selected: string | null;
  onSelect: (id: string) => void;
  title: string;
  subtitle?: string;
}

export const OptionsList: React.FC<OptionsListProps> = ({
  options,
  selected,
  onSelect,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.optionsList}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selected === option.id && styles.optionSelected,
            ]}
            onPress={() => onSelect(option.id)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.optionText,
                selected === option.id && styles.optionTextSelected,
              ]}>
              {option.label}
            </Text>
            {selected === option.id && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1, // Removed to allow ScrollView to handle height
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: 24,
  },
  optionsList: {
    gap: 12,
  },
  option: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.ui.borderDark,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.ui.overlay,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  optionTextSelected: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
