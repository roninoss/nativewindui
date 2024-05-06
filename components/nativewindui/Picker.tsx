import { Picker as RNPicker } from '@react-native-picker/picker';
import { View } from 'react-native';

import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

export function Picker<T>({
  mode = 'dropdown',
  style,
  dropdownIconColor,
  dropdownIconRippleColor,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNPicker<T>>) {
  const { colors } = useColorScheme();
  return (
    <View
      className={cn(
        'ios:shadow-sm ios:shadow-black/5 rounded-md border border-background bg-background',
        className
      )}>
      <RNPicker
        mode={mode}
        style={
          style ?? {
            backgroundColor: colors.root,
            borderRadius: 8,
          }
        }
        dropdownIconColor={dropdownIconColor ?? colors.foreground}
        dropdownIconRippleColor={dropdownIconRippleColor ?? colors.foreground}
        {...props}
      />
    </View>
  );
}

export const PickerItem = RNPicker.Item;
