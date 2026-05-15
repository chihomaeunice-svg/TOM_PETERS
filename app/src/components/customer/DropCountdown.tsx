import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';

interface Props {
  dropDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calcTimeLeft = (target: Date): TimeLeft => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

export const DropCountdown: React.FC<Props> = ({ dropDate }) => {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft(dropDate));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(dropDate)), 1000);
    return () => clearInterval(id);
  }, [dropDate]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>DROP IN</Text>
      <View style={styles.row}>
        {[
          { value: time.days, unit: 'DAYS' },
          { value: time.hours, unit: 'HRS' },
          { value: time.minutes, unit: 'MIN' },
          { value: time.seconds, unit: 'SEC' },
        ].map((item, i) => (
          <React.Fragment key={item.unit}>
            {i > 0 && <Text style={styles.colon}>:</Text>}
            <View style={styles.unit}>
              <Text style={styles.number}>{pad(item.value)}</Text>
              <Text style={styles.unitLabel}>{item.unit}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    ...Typography.labelMD,
    color: Colors.gold,
    marginBottom: Spacing.sm,
    letterSpacing: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unit: {
    alignItems: 'center',
    backgroundColor: Colors.charcoal,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 58,
  },
  number: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 2,
  },
  unitLabel: {
    ...Typography.labelMD,
    fontSize: 8,
    color: Colors.tan,
    marginTop: 2,
  },
  colon: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gold,
    marginHorizontal: 6,
    marginBottom: 14,
  },
});
