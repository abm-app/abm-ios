import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';

import tokens from '@/theme/tokens';

interface CustomCalenderProps {
  visible: boolean;
  onClose: () => void;
  disablePastDates?: boolean;
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

const CALENDAR_COLORS = {
  primaryBlue: tokens.colors.primary,
  lightBlueBg: tokens.colors.badgeLowBg,
  textGrey: tokens.colors.textHint,
  disabledGrey: tokens.colors.border,
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// ─── Sub-Components ─────────────────────────────────────────────────────────

const CalendarHeader = ({
  month,
  year,
  onPrevMonth,
  onNextMonth,
}: {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) => (
  <View style={styles.header}>
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTitle}>
        {MONTHS[month]} {year}
      </Text>
    </View>
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={onPrevMonth} style={styles.navButton}>
        <Ionicons name="chevron-back" size={24} color={CALENDAR_COLORS.primaryBlue} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onNextMonth} style={styles.navButton}>
        <Ionicons name="chevron-forward" size={24} color={CALENDAR_COLORS.primaryBlue} />
      </TouchableOpacity>
    </View>
  </View>
);

const WeekdaysRow = () => (
  <View style={styles.weekDaysContainer}>
    {WEEK_DAYS.map(day => (
      <Text key={day} style={styles.weekDayText}>
        {day}
      </Text>
    ))}
  </View>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export function CustomCalender({
  visible,
  onClose,
  disablePastDates = false,
  selectedDate,
  onSelectDate,
}: CustomCalenderProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [activeDate, setActiveDate] = useState<Date | undefined>(selectedDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const newDate = new Date(year, month, day);
    setActiveDate(newDate);
    if (onSelectDate) onSelectDate(newDate);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateToCheck = new Date(year, month, day);
      const isPast = disablePastDates && dateToCheck < today;
      const isSelected =
        activeDate &&
        activeDate.getDate() === day &&
        activeDate.getMonth() === month &&
        activeDate.getFullYear() === year;

      days.push(
        <Pressable
          key={`day-${day}`}
          disabled={isPast}
          onPress={() => handleSelectDate(day)}
          style={[styles.dayCell, isSelected && styles.selectedDayCell]}
        >
          <Text
            style={[
              styles.dayText,
              isPast && styles.pastDayText,
              isSelected && styles.selectedDayText,
            ]}
          >
            {day}
          </Text>
        </Pressable>,
      );
    }
    return days;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          <CalendarHeader
            month={month}
            year={year}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <WeekdaysRow />

          <View style={styles.daysGrid}>{renderDays()}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: tokens.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: tokens.colors.background,
    borderRadius: 24,
    padding: 24,
    width: 340,
    ...tokens.shadow.modal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 20,
    fontWeight: '400',
    color: tokens.colors.textPrimary,
  },
  navContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  navButton: {
    padding: 4,
  },
  weekDaysContainer: {
    flexDirection: 'row',
  },
  weekDayText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 13,
    fontWeight: '600',
    color: CALENDAR_COLORS.textGrey,
    width: '14.28%',
    textAlign: 'center',
    marginBottom: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 8,
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayCell: {
    backgroundColor: CALENDAR_COLORS.lightBlueBg,
    borderRadius: 20,
  },
  dayText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 18,
    color: tokens.colors.textPrimary,
  },
  pastDayText: {
    color: CALENDAR_COLORS.disabledGrey,
  },
  selectedDayText: {
    color: CALENDAR_COLORS.primaryBlue,
    fontWeight: '600',
  },
});
