import { useActionSheet } from '@expo/react-native-action-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { Icon } from '@roninoss/icons';
import { FlashList } from '@shopify/flash-list';
import * as StoreReview from 'expo-store-review';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import {
  Alert,
  Button as RNButton,
  ButtonProps,
  Linking,
  Platform,
  Pressable,
  Share,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ContextMenu from 'zeego/context-menu';
import * as DropdownMenu from 'zeego/dropdown-menu';

import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/nativewindui/Avatar';
import { DatePicker } from '~/components/nativewindui/DatePicker';
import { Picker, PickerItem } from '~/components/nativewindui/Picker';
import { ProgressIndicator } from '~/components/nativewindui/ProgressIndicator';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { Slider } from '~/components/nativewindui/Slider';
import { Text } from '~/components/nativewindui/Text';
import { Toggle } from '~/components/nativewindui/Toggle';
import { useColorScheme } from '~/lib/useColorScheme';
import { useHeaderSearchBar } from '~/lib/useHeaderSearchBar';

cssInterop(FlashList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

function DefaultButton({ color, ...props }: ButtonProps) {
  const { colors } = useColorScheme();
  return <RNButton color={color ?? colors.primary} {...props} />;
}

export default function Screen() {
  const searchValue = useHeaderSearchBar({ hideWhenScrolling: COMPONENTS.length === 0 });

  const data = searchValue
    ? COMPONENTS.filter((c) => c.name.toLowerCase().includes(searchValue.toLowerCase()))
    : COMPONENTS;

  return (
    <FlashList
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      data={data}
      estimatedItemSize={200}
      contentContainerClassName="py-4 android:pb-12"
      extraData={searchValue}
      removeClippedSubviews={false} // used for selecting text on android
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderItemSeparator}
      renderItem={renderItem}
      ListEmptyComponent={COMPONENTS.length === 0 ? ListEmptyComponent : undefined}
    />
  );
}

function ListEmptyComponent() {
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const { colors } = useColorScheme();
  const height = dimensions.height - headerHeight - insets.bottom - insets.top;

  return (
    <View style={{ height }} className="flex-1 items-center justify-center gap-1 px-12">
      <Icon name="file-plus-outline" size={42} color={colors.grey} />
      <Text variant="title3" className="pb-1 text-center font-semibold">
        No Components Installed
      </Text>
      <Text color="tertiary" variant="subhead" className="pb-4 text-center">
        You can install any of the free components from the{' '}
        <Text
          onPress={() => Linking.openURL('https://nativewindui.com')}
          variant="subhead"
          className="text-primary">
          NativeWindUI
        </Text>
        {' website.'}
      </Text>
    </View>
  );
}

type ComponentItem = { name: string; component: React.FC };

function keyExtractor(item: ComponentItem) {
  return item.name;
}

function renderItemSeparator() {
  return <View className="p-2" />;
}

function renderItem({ item }: { item: ComponentItem }) {
  return (
    <Card title={item.name}>
      <item.component />
    </Card>
  );
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <View className="px-4">
      <View className="gap-4 rounded-xl border border-border bg-card p-4 pb-6 shadow-sm shadow-black/10 dark:shadow-none">
        <Text className="text-center text-sm font-medium tracking-wider opacity-60">{title}</Text>
        {children}
      </View>
    </View>
  );
}

let hasRequestedReview = false;

const COMPONENTS: ComponentItem[] = [
  {
    name: 'Picker',
    component: function PickerExample() {
      const { colors } = useColorScheme();
      const [picker, setPicker] = React.useState('blue');
      return (
        <Picker selectedValue={picker} onValueChange={(itemValue) => setPicker(itemValue)}>
          <PickerItem
            label="Red"
            value="red"
            color={colors.foreground}
            style={{
              backgroundColor: colors.root,
            }}
          />
          <PickerItem
            label="Blue"
            value="blue"
            color={colors.foreground}
            style={{
              backgroundColor: colors.root,
            }}
          />
          <PickerItem
            label="Green"
            value="green"
            color={colors.foreground}
            style={{
              backgroundColor: colors.root,
            }}
          />
        </Picker>
      );
    },
  },

  {
    name: 'Date Picker',
    component: function DatePickerExample() {
      const [date, setDate] = React.useState(new Date());
      return (
        <View className="items-center">
          <DatePicker
            value={date}
            mode="datetime"
            onChange={(ev) => {
              setDate(new Date(ev.nativeEvent.timestamp));
            }}
          />
        </View>
      );
    },
  },

  {
    name: 'Segmented Controls',
    component: function SegmentedControlsExample() {
      const [segment, setSegment] = React.useState(0);
      return (
        <SegmentedControl
          values={['red', 'green', 'blue']}
          selectedIndex={segment}
          onChange={(event) => {
            setSegment(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      );
    },
  },

  {
    name: 'Slider',
    component: function SliderExample() {
      const [sliderValue, setSliderValue] = React.useState(0.5);
      return <Slider value={sliderValue} onValueChange={setSliderValue} />;
    },
  },

  {
    name: 'Toggle',
    component: function ToggleExample() {
      const [switchValue, setSwitchValue] = React.useState(true);
      return (
        <View className="items-center">
          <Toggle value={switchValue} onValueChange={setSwitchValue} />
        </View>
      );
    },
  },

  {
    name: 'Context Menu',
    component: function ContextMenuExample() {
      const [isChecked, setIsChecked] = React.useState(true);
      return (
        <View>
          <ContextMenu.Root style={{ borderRadius: 12 }}>
            <ContextMenu.Trigger>
              <View className="h-36 w-full items-center justify-center rounded-xl border border-dashed border-foreground">
                <Text>Press and hold me</Text>
              </View>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Label children="Label 1" />
              <ContextMenu.Item key="item-1">
                <ContextMenu.ItemTitle>Item 1</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Group>
                <ContextMenu.Item key="item-2">
                  <ContextMenu.ItemTitle>Item 2</ContextMenu.ItemTitle>
                </ContextMenu.Item>
                <ContextMenu.CheckboxItem
                  key="checkbox-example"
                  value={isChecked}
                  onValueChange={(val) => {
                    setIsChecked(val === 'on');
                  }}>
                  <ContextMenu.ItemTitle>Item 3</ContextMenu.ItemTitle>
                  <ContextMenu.ItemIndicator />
                </ContextMenu.CheckboxItem>
              </ContextMenu.Group>
              <ContextMenu.Separator />
            </ContextMenu.Content>
          </ContextMenu.Root>
        </View>
      );
    },
  },

  {
    name: 'Dropdown Menu',
    component: function DropdownMenuExample() {
      const { colors } = useColorScheme();
      const [menu, setMenu] = React.useState<'primary' | 'destructive'>('primary');

      return (
        <View className="items-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Pressable className="android:gap-3 flex-row items-center gap-1.5">
                <Text>
                  Selected: <Text style={{ color: colors[menu] }}>{menu}</Text>
                </Text>
                <View className="pl-0.5 opacity-70">
                  <Icon name="chevron-down" color={colors.foreground} size={21} />
                </View>
              </Pressable>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.CheckboxItem
                key="destructive"
                value={menu === 'destructive'}
                onValueChange={() => {
                  setMenu('destructive');
                }}>
                <DropdownMenu.ItemIndicator />
                <DropdownMenu.ItemTitle children="destructive" />
              </DropdownMenu.CheckboxItem>
              <DropdownMenu.CheckboxItem
                key="primary"
                value={menu === 'primary'}
                onValueChange={() => {
                  setMenu('primary');
                }}>
                <DropdownMenu.ItemIndicator />
                <DropdownMenu.ItemTitle children="primary" />
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </View>
      );
    },
  },

  {
    name: 'Progress Indicator',
    component: function ProgressIndicatorExample() {
      const [progress, setProgress] = React.useState(13);
      let id: ReturnType<typeof setInterval> | null = null;
      React.useEffect(() => {
        if (!id) {
          id = setInterval(() => {
            setProgress((prev) => (prev >= 99 ? 0 : prev + 5));
          }, 1000);
        }
        return () => {
          if (id) clearInterval(id);
        };
      }, []);
      return (
        <View className="p-4">
          <ProgressIndicator value={progress} />
        </View>
      );
    },
  },

  {
    name: 'Activity Indicator',
    component: function ActivityIndicatorExample() {
      return (
        <View className="items-center p-4">
          <ActivityIndicator />
        </View>
      );
    },
  },

  {
    name: 'Alert',
    component: function AlertExample() {
      const { colors } = useColorScheme();
      return (
        <View className="items-center">
          <DefaultButton
            color={colors.destructive}
            onPress={() => {
              if (Platform.OS === 'ios') {
                Alert.prompt(
                  'Delete account?',
                  'Enter your password to delete your account.',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => console.log('Delete Pressed'),
                    },
                  ],
                  'secure-text',
                  '',
                  'default'
                );
              } else {
                Alert.alert('Delete account?', 'Enter your password to delete your account.', [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => console.log('Delete Pressed'),
                  },
                ]);
              }
            }}
            title="Delete account"
          />
        </View>
      );
    },
  },

  {
    name: 'Action Sheet',
    component: function ActionSheetExample() {
      const { colorScheme, colors } = useColorScheme();
      const { showActionSheetWithOptions } = useActionSheet();
      return (
        <View className="items-center">
          <DefaultButton
            color="grey"
            onPress={async () => {
              const options = ['Delete', 'Save', 'Cancel'];
              const destructiveButtonIndex = 0;
              const cancelButtonIndex = 2;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  destructiveButtonIndex,
                  containerStyle: {
                    backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
                  },
                  textStyle: {
                    color: colors.foreground,
                  },
                },
                (selectedIndex) => {
                  switch (selectedIndex) {
                    case 1:
                      // Save
                      break;

                    case destructiveButtonIndex:
                      // Delete
                      break;

                    case cancelButtonIndex:
                    // Canceled
                  }
                }
              );
            }}
            title="Open action sheet"
          />
        </View>
      );
    },
  },

  {
    name: 'Text',
    component: function TextExample() {
      return (
        <View className="gap-2">
          <Text variant="largeTitle" className="text-center">
            Large Title
          </Text>
          <Text variant="title1" className="text-center">
            Title 1
          </Text>
          <Text variant="title2" className="text-center">
            Title 2
          </Text>
          <Text variant="title3" className="text-center">
            Title 3
          </Text>
          <Text variant="heading" className="text-center">
            Heading
          </Text>
          <Text variant="body" className="text-center">
            Body
          </Text>
          <Text variant="callout" className="text-center">
            Callout
          </Text>
          <Text variant="subhead" className="text-center">
            Subhead
          </Text>
          <Text variant="footnote" className="text-center">
            Footnote
          </Text>
          <Text variant="caption1" className="text-center">
            Caption 1
          </Text>
          <Text variant="caption2" className="text-center">
            Caption 2
          </Text>
        </View>
      );
    },
  },

  {
    name: 'Selectable Text',
    component: function SelectableTextExample() {
      return (
        <Text uiTextView selectable>
          Long press or double press this text
        </Text>
      );
    },
  },

  {
    name: 'Ratings Indicator',
    component: function RatingsIndicatorExample() {
      React.useEffect(() => {
        async function showRequestReview() {
          if (hasRequestedReview) return;
          try {
            if (await StoreReview.hasAction()) {
              await StoreReview.requestReview();
            }
          } catch (error) {
            console.log(
              'FOR ANDROID: Make sure you meet all conditions to be able to test and use it: https://developer.android.com/guide/playcore/in-app-review/test#troubleshooting',
              error
            );
          } finally {
            hasRequestedReview = true;
          }
        }
        const timeout = setTimeout(() => {
          showRequestReview();
        }, 1000);

        return () => clearTimeout(timeout);
      }, []);

      return (
        <View className="gap-3">
          <Text className="pb-2 text-center font-semibold">Please follow the guidelines.</Text>
          <View className="flex-row">
            <Text className="w-6 text-center text-muted-foreground">·</Text>
            <View className="flex-1">
              <Text variant="caption1" className="text-muted-foreground">
                Don't call StoreReview.requestReview() from a button
              </Text>
            </View>
          </View>
          <View className="flex-row">
            <Text className="w-6 text-center text-muted-foreground">·</Text>
            <View className="flex-1">
              <Text variant="caption1" className="text-muted-foreground">
                Don't request a review when the user is doing something time sensitive.
              </Text>
            </View>
          </View>
          <View className="flex-row">
            <Text className="w-6 text-center text-muted-foreground">·</Text>
            <View className="flex-1">
              <Text variant="caption1" className="text-muted-foreground">
                Don't ask the user any questions before or while presenting the rating button or
                card.
              </Text>
            </View>
          </View>
        </View>
      );
    },
  },

  {
    name: 'Activity View',
    component: function ActivityViewExample() {
      return (
        <View className="items-center">
          <DefaultButton
            onPress={async () => {
              try {
                const result = await Share.share({
                  message: 'NativeWindUI | Familiar interface, native feel.',
                });
                if (result.action === Share.sharedAction) {
                  if (result.activityType) {
                    // shared with activity type of result.activityType
                  } else {
                    // shared
                  }
                } else if (result.action === Share.dismissedAction) {
                  // dismissed
                }
              } catch (error: any) {
                Alert.alert(error.message);
              }
            }}
            title="Share a message"
          />
        </View>
      );
    },
  },

  {
    name: 'Bottom Sheet',
    component: function BottomSheetExample() {
      const { colorScheme } = useColorScheme();
      const bottomSheetModalRef = useSheetRef();

      return (
        <View className="items-center">
          <DefaultButton
            color={colorScheme === 'dark' && Platform.OS === 'ios' ? 'white' : 'black'}
            title="Open Bottom Sheet"
            onPress={() => bottomSheetModalRef.current?.present()}
          />
          <Sheet ref={bottomSheetModalRef} snapPoints={[200]}>
            <View className="flex-1 items-center justify-center pb-8">
              <Text>@gorhom/bottom-sheet 🎉</Text>
            </View>
          </Sheet>
        </View>
      );
    },
  },

  {
    name: 'Avatar',
    component: function AvatarExample() {
      const TWITTER_AVATAR_URI =
        'https://pbs.twimg.com/profile_images/1782428433898708992/1voyv4_A_400x400.jpg';
      return (
        <View className="items-center">
          <Avatar alt="NativeWindUI Avatar">
            <AvatarImage source={{ uri: TWITTER_AVATAR_URI }} />
            <AvatarFallback>
              <Text>NUI</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      );
    },
  },
];
