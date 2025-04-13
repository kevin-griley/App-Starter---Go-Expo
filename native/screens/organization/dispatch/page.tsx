'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { TableView } from './table-view';

import { ThemeToggle } from '@/components/ThemeToggle';
import { Text } from '@/components/ui/text';
import Drawer from 'expo-router/drawer';
import { View } from 'react-native';
import { OrgLayout } from '../layout';

function DispatchDashboard() {
    const [activeView, setActiveView] = useState('table');

    return (
        <View className="flex flex-col">
            <View className="flex-1 space-y-4">
                <View className="flex flex-row items-center justify-center md:justify-end">
                    <View className="flex items-center gap-2">
                        <Tabs
                            value={activeView}
                            onValueChange={setActiveView}
                            className="w-full self-center flex-col gap-1.5"
                        >
                            <TabsList className="w-full flex flex-row bg-bw">
                                <TabsTrigger value="table">
                                    <Text className="text-text">
                                        Table View
                                    </Text>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </View>
                </View>

                {activeView === 'table' && (
                    <View className="w-full">
                        <TableView />
                    </View>
                )}
            </View>
        </View>
    );
}

export default function DispatchPage() {
    return (
        <>
            <Drawer.Screen
                options={{
                    headerRight: () => <ThemeToggle />,
                }}
            />

            <OrgLayout>
                <DispatchDashboard />
            </OrgLayout>
        </>
    );
}
