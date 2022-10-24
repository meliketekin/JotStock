import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Navigation from "./Navigation/Navigation";
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://dd3c1ff67c6246e68afa37e28be5b274@o1395594.ingest.sentry.io/6718580',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({});
