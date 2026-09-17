import { PropsWithChildren, useState } from 'react';
import { useLaunch } from '@tarojs/taro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './app.css';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			networkMode: 'always',
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000,
		},
	},
});

function App({ children }: PropsWithChildren<any>) {
	const { initAuth } = useAuth();

	useLaunch(() => initAuth('wechat'));

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default App;
