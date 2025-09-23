import '@/global.css';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Icon } from '@/components/nativewindui/Icon';
import { ThemeToggle } from '@/components/nativewindui/ThemeToggle';
import { useColorScheme } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />

      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
              <Stack>
                <Stack.Screen name="index" options={INDEX_OPTIONS} />
                <Stack.Screen name="modal" options={MODAL_OPTIONS} />
              </Stack>
            </NavThemeProvider>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const INDEX_OPTIONS = {
  headerLargeTitle: true,
  title: 'NativeWindUI',
  headerRight: () => <SettingsIcon />,
} as const;

function SettingsIcon() {
  return (
    <Link href="/modal" asChild>
      <Pressable className="opacity-80 active:opacity-50">
        <Icon name="gearshape" className="text-foreground" />
      </Pressable>
    </Link>
  );
}

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;
