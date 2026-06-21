import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  X,
} from 'phosphor-react-native';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Layout, Radius, Spacing, Typography } from '@/constants/theme';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_HEADER_HEIGHT = 28;
const DAY_CELL_HEIGHT = 36;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function buildCells(year: number, month: number): (number | null)[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function calendarHeight(numRows: number) {
  return DAY_HEADER_HEIGHT + numRows * DAY_CELL_HEIGHT;
}

function formatDisplay(date: Date): string {
  const datePart = date.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
  return `${datePart} · ${timePart}`;
}

export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = 'Set due date & time',
}: DateTimePickerProps) {
  const { colors } = useTheme();
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(true);
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [hour, setHour] = useState(value ? (value.getHours() % 12 || 12) : 12);
  const [minute, setMinute] = useState(value ? value.getMinutes() : 0);
  const [period, setPeriod] = useState<'AM' | 'PM'>(
    value ? (value.getHours() >= 12 ? 'PM' : 'AM') : 'AM'
  );

  const cells = buildCells(viewYear, viewMonth);
  const numRows = cells.length / 7;
  const maxCalHeight = calendarHeight(numRows);

  const calAnim = useRef(new Animated.Value(1)).current;
  const chevronAnim = useRef(new Animated.Value(1)).current;

  const animateCal = (toOpen: boolean) => {
    Animated.parallel([
      Animated.timing(calAnim, {
        toValue: toOpen ? 1 : 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(chevronAnim, {
        toValue: toOpen ? 1 : 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleCal = () => {
    const next = !calOpen;
    setCalOpen(next);
    animateCal(next);
  };

  // When month changes while collapsed, re-measure
  useEffect(() => {
    if (calOpen) {
      // re-open to correct height if numRows changed
      calAnim.setValue(1);
    }
  }, [viewMonth, viewYear]);

  const applyTime = (base: Date, h = hour, m = minute, p = period) => {
    const d = new Date(base);
    let hh = h % 12;
    if (p === 'PM') hh += 12;
    d.setHours(hh, m, 0, 0);
    return d;
  };

  const handleDayPress = (day: number) => {
    const base = new Date(viewYear, viewMonth, day);
    onChange(applyTime(base));
    // collapse calendar after selection
    setCalOpen(false);
    animateCal(false);
  };

  const stepHour = (dir: 1 | -1) => {
    const next = ((hour - 1 + dir + 12) % 12) + 1;
    setHour(next);
    if (value) onChange(applyTime(value, next, minute, period));
  };

  const stepMinute = (dir: 1 | -1) => {
    const next = (minute + dir * 5 + 60) % 60;
    setMinute(next);
    if (value) onChange(applyTime(value, hour, next, period));
  };

  const togglePeriod = () => {
    const next = period === 'AM' ? 'PM' : 'AM';
    setPeriod(next);
    if (value) onChange(applyTime(value, hour, minute, next));
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    if (!calOpen) { setCalOpen(true); animateCal(true); }
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    if (!calOpen) { setCalOpen(true); animateCal(true); }
  };

  const isSelectedDay = (day: number) =>
    value?.getDate() === day &&
    value?.getMonth() === viewMonth &&
    value?.getFullYear() === viewYear;

  const isTodayDay = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  const animHeight = calAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxCalHeight],
  });
  const animOpacity = calAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: colors.foregroundMuted }]}>{label}</Text>
      )}

      <View style={styles.triggerRow}>
        <Pressable
          style={[styles.trigger, { backgroundColor: colors.insetSurface, borderColor: colors.borderStrong }]}
          onPress={() => {
            if (open) {
              setOpen(false);
            } else {
              setOpen(true);
              setCalOpen(true);
              calAnim.setValue(1);
              chevronAnim.setValue(1);
            }
          }}
        >
          <CalendarBlank size={16} color={colors.foregroundSubtle} />
          <Text style={[styles.triggerText, { color: value ? colors.foreground : colors.foregroundSubtle }]}>
            {value ? formatDisplay(value) : placeholder}
          </Text>
        </Pressable>

        {value && (
          <Pressable
            style={[styles.clearBtn, { borderColor: colors.borderStrong }]}
            onPress={() => { onChange(null); setOpen(false); }}
            hitSlop={8}
          >
            <X size={14} color={colors.foregroundSubtle} />
          </Pressable>
        )}
      </View>

      {open && (
        <View style={[styles.picker, { backgroundColor: colors.insetSurface, borderColor: colors.borderStrong }]}>

          {/* Month nav — tapping label toggles calendar */}
          <View style={styles.monthNav}>
            <Pressable onPress={prevMonth} hitSlop={8} style={styles.navBtn}>
              <CaretLeft size={15} color={colors.foreground} weight="bold" />
            </Pressable>

            <Pressable style={styles.monthLabelRow} onPress={toggleCal} hitSlop={4}>
              <Text style={[styles.monthLabel, { color: colors.foreground }]}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>
              <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
                <CaretDown size={13} color={colors.foregroundMuted} weight="bold" />
              </Animated.View>
            </Pressable>

            <Pressable onPress={nextMonth} hitSlop={8} style={styles.navBtn}>
              <CaretRight size={15} color={colors.foreground} weight="bold" />
            </Pressable>
          </View>

          {/* Animated calendar grid */}
          <Animated.View style={{ height: animHeight, overflow: 'hidden' }}>
            <Animated.View style={{ opacity: animOpacity }}>
              {/* Day headers */}
              <View style={styles.dayRow}>
                {DAYS.map(d => (
                  <Text key={d} style={[styles.dayHeader, { color: colors.foregroundSubtle }]}>{d}</Text>
                ))}
              </View>

              {/* Day grid */}
              {Array.from({ length: numRows }, (_, row) => (
                <View key={row} style={styles.dayRow}>
                  {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
                    const selected = day !== null && isSelectedDay(day);
                    const todayMark = day !== null && isTodayDay(day);
                    return (
                      <Pressable
                        key={col}
                        style={[
                          styles.dayCell,
                          selected && { backgroundColor: colors.primaryBg, borderRadius: Radius.md },
                        ]}
                        onPress={() => day !== null && handleDayPress(day)}
                        disabled={day === null}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            { color: colors.foreground },
                            todayMark && !selected && { color: colors.foregroundMuted, fontFamily: Fonts.semibold },
                            selected && { color: colors.primaryText, fontFamily: Fonts.semibold },
                            day === null && { opacity: 0 },
                          ]}
                        >
                          {day ?? 1}
                        </Text>
                        {todayMark && !selected && (
                          <View style={[styles.todayDot, { backgroundColor: colors.foregroundSubtle }]} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </Animated.View>
          </Animated.View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Time selector */}
          <View style={styles.timeRow}>
            <View style={styles.timeUnit}>
              <Pressable onPress={() => stepHour(1)} hitSlop={8}>
                <CaretUp size={14} color={colors.foregroundMuted} weight="bold" />
              </Pressable>
              <Text style={[styles.timeValue, { color: colors.foreground }]}>
                {String(hour).padStart(2, '0')}
              </Text>
              <Pressable onPress={() => stepHour(-1)} hitSlop={8}>
                <CaretDown size={14} color={colors.foregroundMuted} weight="bold" />
              </Pressable>
            </View>

            <Text style={[styles.timeSep, { color: colors.foregroundSubtle }]}>:</Text>

            <View style={styles.timeUnit}>
              <Pressable onPress={() => stepMinute(1)} hitSlop={8}>
                <CaretUp size={14} color={colors.foregroundMuted} weight="bold" />
              </Pressable>
              <Text style={[styles.timeValue, { color: colors.foreground }]}>
                {String(minute).padStart(2, '0')}
              </Text>
              <Pressable onPress={() => stepMinute(-1)} hitSlop={8}>
                <CaretDown size={14} color={colors.foregroundMuted} weight="bold" />
              </Pressable>
            </View>

            <Pressable
              style={[styles.periodBtn, { borderColor: colors.borderStrong, backgroundColor: colors.insetSurface }]}
              onPress={togglePeriod}
            >
              <Text style={[styles.periodText, { color: colors.foreground }]}>{period}</Text>
            </Pressable>
          </View>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...Typography.label,
    fontFamily: Fonts.medium,
    marginBottom: Spacing.xs,
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trigger: {
    flex: 1,
    height: Layout.inputHeight,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  triggerText: {
    ...Typography.body,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    marginTop: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.base,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  monthLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  navBtn: {
    padding: Spacing.sm,
  },
  monthLabel: {
    ...Typography.label,
    fontFamily: Fonts.semibold,
  },
  dayRow: {
    flexDirection: 'row',
  },
  dayHeader: {
    flex: 1,
    height: DAY_HEADER_HEIGHT,
    textAlign: 'center',
    ...Typography.caption,
    fontFamily: Fonts.medium,
    textAlignVertical: 'center',
  },
  dayCell: {
    flex: 1,
    height: DAY_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    ...Typography.caption,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  todayDot: {
    width: 3,
    height: 3,
    borderRadius: 9999,
    marginTop: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  timeUnit: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timeValue: {
    ...Typography.h3,
    fontFamily: Fonts.semibold,
    minWidth: 40,
    textAlign: 'center',
  },
  timeSep: {
    ...Typography.h3,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing.sm,
  },
  periodBtn: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  periodText: {
    ...Typography.label,
    fontFamily: Fonts.semibold,
  },
});
