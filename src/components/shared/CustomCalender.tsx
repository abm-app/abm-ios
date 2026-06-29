import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';

import tokens from '@/theme/tokens';

interface CustomCalenderProps {
  visible: boolean;
  onClose: () => void;
  disablePastDates?: boolean;
  selectedDate?: Date;
  minDate?: Date;
  onSelectDate?: (date: Date) => void;
  useModal?: boolean;
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
  minDate,
  onSelectDate,
  useModal = true,
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
      let isPast = disablePastDates && dateToCheck < today;
      if (minDate && minDate > dateToCheck) {
        isPast = true;
      }

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

  if (!visible) return null;

  const content = (
    <Pressable style={[styles.overlay, !useModal && styles.absoluteOverlay]} onPress={onClose}>
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
  );

  if (useModal === false) {
    return content;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {content}
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
  absoluteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  card: {
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.calendar.borderRadius,
    padding: tokens.calendar.padding,
    width: tokens.calendar.width,
    maxWidth: '100%',
    shadowColor: tokens.shadow.modal.shadowColor,
    shadowOffset: tokens.shadow.modal.shadowOffset,
    shadowOpacity: tokens.shadow.modal.shadowOpacity,
    shadowRadius: tokens.shadow.modal.shadowRadius,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.calendar.headerMarginBottom,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  navButton: {
    padding: tokens.spacing.sm,
  },
  headerTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.calendar.headerFontSize,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.calendar.navPadding,
  },
  weekDayText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.calendar.weekdayFontSize,
    color: tokens.colors.textMuted,
    width: 40,
    textAlign: 'center',
    marginBottom: tokens.calendar.weekdayMarginBottom,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: tokens.calendar.dayHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  dayText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textPrimary,
  },
  pastDayText: {
    color: tokens.colors.textHint,
  },
  selectedDayCell: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.calendar.dayRadius,
  },
  selectedDayText: {
    color: tokens.colors.background,
    fontWeight: '600',
  },
  dayCellToday: {
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.primary,
    borderRadius: tokens.calendar.dayRadius,
  },
  dayTextToday: {
    color: tokens.colors.primary,
    fontWeight: '600',
  },
});
