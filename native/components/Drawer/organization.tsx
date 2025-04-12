import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import type { Href } from 'expo-router';
import { router, usePathname } from 'expo-router';

import type { LucideIcon } from 'lucide-react-native';

import { BriefcaseBusiness } from '@/lib/icons/BriefcaseBusiness';
import { Building } from '@/lib/icons/Building';
import { MoonStar } from '@/lib/icons/MoonStar';
import { Network } from '@/lib/icons/Network';
import { Sun } from '@/lib/icons/Sun';
import { Truck } from '@/lib/icons/Truck';
import { LogOut } from 'lucide-react-native';

import * as React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrganization } from '../OrganizationProvider';
import { useSession } from '../SessionProvider';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Text } from '../ui/text';

import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { useColorScheme } from '@/lib/useColorScheme';

const SIDEBAR_ITEMS: {
    href: Href;
    icon: LucideIcon;
    label: string;
}[] = [
    {
        href: '/dashboard',
        icon: Building,
        label: 'Dashboard',
    },
    {
        href: '/dispatch',
        icon: Truck,
        label: 'Dispatch',
    },
];

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (
    props,
) => {
    const { session, logout } = useSession();
    const { setOrganization } = useOrganization();

    const pathname = usePathname();
    const { bottom } = useSafeAreaInsets();

    const { isDarkColorScheme, setColorScheme } = useColorScheme();

    function toggleColorScheme() {
        const newTheme = isDarkColorScheme ? 'light' : 'dark';
        setColorScheme(newTheme);
        setAndroidNavigationBar(newTheme);
    }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View className="p-4 flex flex-row items-center gap-x-4">
                    <Avatar alt="User Avatar">
                        <AvatarFallback>
                            <Text>
                                {session?.user_name?.charAt(0).toUpperCase()}
                            </Text>
                        </AvatarFallback>
                    </Avatar>

                    <Text>{session?.email}</Text>
                </View>

                <View className="h-4 border-b-2 border-border" />
                <View className="h-4 " />

                {SIDEBAR_ITEMS.map((item) => {
                    const focused = pathname === item.href;
                    const textColor = focused ? 'var(--mtext)' : 'var(--text)';
                    const textClass = focused ? 'text-mtext' : 'text-text';
                    const isWeb = Platform.OS === 'web';

                    return (
                        <DrawerItem
                            style={{ borderRadius: 8 }}
                            icon={({ size, color }) => (
                                <item.icon
                                    color={isWeb ? textColor : color}
                                    size={size}
                                />
                            )}
                            label={({ color }) => (
                                <Text className={isWeb ? textClass : color}>
                                    {item.label}
                                </Text>
                            )}
                            labelStyle={{
                                fontFamily: 'SpaceMono',
                                fontSize: 16,
                            }}
                            focused={focused}
                            onPress={() => {
                                router.push(item.href);
                            }}
                            activeBackgroundColor="var(--main)"
                        />
                    );
                })}
            </DrawerContentScrollView>

            <View
                className="border-t-2 border-border bg-bg"
                style={{ paddingBottom: bottom + 20, paddingTop: 20 }}
            >
                <DrawerItem
                    style={{ borderRadius: 8 }}
                    icon={({ color, size }) => (
                        <Network color={color} size={size} />
                    )}
                    label="Site Map"
                    labelStyle={{ fontFamily: 'SpaceMono', fontSize: 16 }}
                    onPress={() => {
                        router.push('/_sitemap');
                    }}
                />

                <DrawerItem
                    style={{ borderRadius: 8 }}
                    icon={({ color, size }) =>
                        isDarkColorScheme ? (
                            <MoonStar size={size} color={color} />
                        ) : (
                            <Sun size={size} color={color} />
                        )
                    }
                    label="Dark Mode"
                    labelStyle={{ fontFamily: 'SpaceMono', fontSize: 16 }}
                    onPress={async () => toggleColorScheme()}
                />

                <DrawerItem
                    style={{ borderRadius: 8 }}
                    icon={({ color, size }) => (
                        <BriefcaseBusiness color={color} size={size} />
                    )}
                    label="My Account"
                    labelStyle={{ fontFamily: 'SpaceMono', fontSize: 16 }}
                    onPress={async () => setOrganization(null)}
                />
                <DrawerItem
                    style={{ borderRadius: 8 }}
                    icon={({ color, size }) => (
                        <LogOut color={color} size={size} />
                    )}
                    label="Logout"
                    labelStyle={{ fontFamily: 'SpaceMono', fontSize: 16 }}
                    onPress={logout}
                />
            </View>
        </View>
    );
};
