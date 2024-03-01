import NetInfo from '@react-native-community/netinfo';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState } from 'react-native';

import Home from './src/screens/Home';

const client = new QueryClient({
  queryCache: new QueryCache(),
});

export default function App() {
  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });
  }, [NetInfo, onlineManager]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onFocusState);

    return () => subscription.remove();
  }, []);

  const onFocusState = (status: AppStateStatus) => {
    focusManager.setFocused(status === 'active');
  };

  return (
    <QueryClientProvider client={client}>
      <StatusBar style='light' backgroundColor='#111' translucent />
      <Home />
    </QueryClientProvider>
  );
}
