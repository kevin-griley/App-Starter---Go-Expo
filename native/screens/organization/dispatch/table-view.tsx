'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Plus, RefreshCw } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TableView() {
    const [selectedLoads, setSelectedLoads] = React.useState<string[]>([]);

    const toggleLoadSelection = (loadId: string) => {
        if (selectedLoads.includes(loadId)) {
            setSelectedLoads(selectedLoads.filter((id) => id !== loadId));
        } else {
            setSelectedLoads([...selectedLoads, loadId]);
        }
    };

    const insets = useSafeAreaInsets();

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-4">
                <View className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                        Orders List
                    </CardTitle>
                    <View className="flex flex-row items-center gap-2">
                        <Button
                            size="sm"
                            className="flex flex-row items-center bg-info"
                        >
                            <RefreshCw className="mr-2 h-4 w-4 text-mtext" />
                            <Text>Refresh</Text>
                        </Button>
                        <Button
                            size="sm"
                            className="flex flex-row items-center bg-accent"
                        >
                            <Plus className="mr-2 h-4 w-4 text-mtext" />
                            <Text>Add Load</Text>
                        </Button>
                    </View>
                </View>
            </CardHeader>
            <CardContent className="p-0"></CardContent>
        </Card>
    );
}

const loads = [
    {
        id: 'LD-1001',
        status: 'Pending',
        origin: 'Chicago, IL',
        destination: 'Indianapolis, IN',
        distance: 182,
        cargoType: 'Palletized',
        weight: '12,500',
        deadline: '04/10/2025',
        equipment: 'Dry Van',
    },
    {
        id: 'LD-1002',
        status: 'Active',
        origin: 'Detroit, MI',
        destination: 'Cleveland, OH',
        distance: 170,
        cargoType: 'Automotive',
        weight: '18,200',
        deadline: '04/09/2025',
        equipment: 'Flatbed',
    },
    {
        id: 'LD-1003',
        status: 'Delayed',
        origin: 'Columbus, OH',
        destination: 'Pittsburgh, PA',
        distance: 185,
        cargoType: 'Machinery',
        weight: '22,000',
        deadline: '04/08/2025',
        equipment: 'Lowboy',
    },
    {
        id: 'LD-1004',
        status: 'Pending',
        origin: 'Cincinnati, OH',
        destination: 'Louisville, KY',
        distance: 100,
        cargoType: 'Consumer Goods',
        weight: '15,800',
        deadline: '04/11/2025',
        equipment: 'Dry Van',
    },
    {
        id: 'LD-1005',
        status: 'Active',
        origin: 'St. Louis, MO',
        destination: 'Nashville, TN',
        distance: 309,
        cargoType: 'Food Products',
        weight: '16,500',
        deadline: '04/09/2025',
        equipment: 'Reefer',
    },
    {
        id: 'LD-1006',
        status: 'Delivered',
        origin: 'Milwaukee, WI',
        destination: 'Minneapolis, MN',
        distance: 337,
        cargoType: 'Retail',
        weight: '14,200',
        deadline: '04/07/2025',
        equipment: 'Dry Van',
    },
    {
        id: 'LD-1007',
        status: 'Pending',
        origin: 'Kansas City, MO',
        destination: 'Omaha, NE',
        distance: 190,
        cargoType: 'Agricultural',
        weight: '21,000',
        deadline: '04/12/2025',
        equipment: 'Hopper',
    },
    {
        id: 'LD-1008',
        status: 'Active',
        origin: 'Indianapolis, IN',
        destination: 'Columbus, OH',
        distance: 175,
        cargoType: 'Electronics',
        weight: '8,500',
        deadline: '04/10/2025',
        equipment: 'Dry Van',
    },
];
