import DateTimePicker from '@react-native-community/datetimepicker';
import * as React from 'react';

export function DatePicker(
  props: React.ComponentProps<typeof DateTimePicker> & {
    mode: 'date' | 'time' | 'datetime';
  }
) {
  return <DateTimePicker {...props} />;
}
