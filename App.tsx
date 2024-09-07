import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import Toast from 'react-native-toast-message';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigation />
      <Toast position="top" topOffset={40} />
    </QueryClientProvider>
  );
}
