import { View, Text } from '@tarojs/components';
import { Page } from '@/components/ui';

export default function Home() {
	return (
		<Page hasTabBar paddingX={false} className="bg-gray-100 min-h-screen">
			<View>
				<Text>Home</Text>
			</View>
		</Page>
	);
}
