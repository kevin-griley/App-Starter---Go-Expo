import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';

import { Home, LogOut, Network, Newspaper } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../SessionProvider';
import { Text } from '../ui/text';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (
    props,
) => {
    const { session, logout } = useSession();
    const pathname = usePathname();
    const { bottom } = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View className="p-4">
                    <Text>{session?.user_name}</Text>
                    <Text>{session?.email}</Text>
                </View>

                <View className="h-4" />

                <DrawerItem
                    style={{ borderRadius: 8 }}
                    icon={(props) => <Home {...props} />}
                    label="Dashboard"
                    labelStyle={{ fontFamily: 'SpaceMono', fontSize: 16 }}
                    focused={pathname === '/dashboard'}
                    onPress={() => {
                        router.push('/dashboard');
                    }}
                />

                <DrawerItem
                    style={{ borderRadius: 8 }}
                    icon={(props) => <Newspaper {...props} />}
                    label="Newsfeed"
                    labelStyle={{ fontFamily: 'SpaceMono', fontSize: 16 }}
                    focused={pathname === '/feed'}
                    onPress={() => {
                        router.push('/feed');
                    }}
                />
            </DrawerContentScrollView>

            <View
                className="border-t border-border"
                style={{ paddingBottom: bottom + 20 }}
            >
                <DrawerItem
                    style={{ borderRadius: 8 }}
                    icon={(props) => <Network {...props} />}
                    label="Site Map"
                    labelStyle={{ fontFamily: 'SpaceMono', fontSize: 16 }}
                    onPress={() => {
                        router.push('/_sitemap');
                    }}
                />
                <DrawerItem
                    style={{ borderRadius: 8 }}
                    icon={(props) => <LogOut {...props} />}
                    label="Logout"
                    labelStyle={{ fontFamily: 'SpaceMono', fontSize: 16 }}
                    onPress={logout}
                />
            </View>
        </View>
    );
};
