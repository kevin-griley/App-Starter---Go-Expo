'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { TableView } from './table-view';

import { Text } from '@/components/ui/text';
import { H2 } from '@/components/ui/typography';
import { View } from 'react-native';
import { OrgLayout } from '../layout';
import { DashboardHeader } from './dashboard-header';

function DispatchDashboard() {
    const [activeView, setActiveView] = useState('dual');

    return (
        <View className="flex min-h-screen flex-col">
            <DashboardHeader />

            <View className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <View className="flex flex-row items-center justify-between">
                    <H2 className="text-3xl font-bold tracking-tight">
                        Dispatch Management
                    </H2>
                    <View className="flex items-center gap-2">
                        <Tabs
                            value={activeView}
                            onValueChange={setActiveView}
                            className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
                        >
                            <TabsList className="w-full flex flex-row bg-bw">
                                <TabsTrigger value="dual">
                                    <Text className="text-text">Dual View</Text>
                                </TabsTrigger>
                                <TabsTrigger value="table">
                                    <Text className="text-text">
                                        Table View
                                    </Text>
                                </TabsTrigger>
                                <TabsTrigger value="tile">
                                    <Text className="text-text">Tile View</Text>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </View>
                </View>

                {activeView === 'table' && (
                    <div className="w-full">
                        <TableView />
                    </div>
                )}
            </View>
        </View>
    );
}

export default function DispatchPage() {
    return (
        <OrgLayout>
            <DispatchDashboard />
        </OrgLayout>
    );
}
