import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {useEffect} from "react";
import {SafeAreaView, View} from "react-native";
import "react-native-reanimated";
import Home from "./(routes)/home";
import {ReactNativeExtension} from "@dynamic-labs/react-native-extension";
import {createClient} from "@dynamic-labs/client";

export const client = createClient({
  environmentId: process.env.ENVIRONMENT_ID!,
}).extend(ReactNativeExtension());

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      {/* <client.reactNative.WebView /> */}
      <View>
        <Home />
      </View>
    </>
  );
}
