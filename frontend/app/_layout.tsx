import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { LogBox, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";

LogBox.ignoreAllLogs(true);
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useIconFonts();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#161311' }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#161311' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
