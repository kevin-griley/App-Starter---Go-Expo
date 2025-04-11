'use client';

import type { BadgeProps } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { FlashList } from '@shopify/flash-list';
import {
    ArrowDownUp,
    Filter,
    MoreHorizontal,
    Plus,
    RefreshCw,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
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
                        Consolidation & Detail Layer
                    </CardTitle>
                    <View className="flex flex-row items-center gap-2">
                        <Button
                            variant="neutral"
                            size="sm"
                            className="flex flex-row items-center"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            <Text>Filter</Text>
                        </Button>
                        <Button
                            variant="neutral"
                            size="sm"
                            className="flex flex-row items-center"
                        >
                            <ArrowDownUp className="mr-2 h-4 w-4" />
                            <Text>Sort</Text>
                        </Button>
                        <Button
                            variant="neutral"
                            size="sm"
                            className="flex flex-row items-center"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            <Text>Refresh</Text>
                        </Button>
                        <Button
                            size="sm"
                            className="flex flex-row items-center"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            <Text>Add Load</Text>
                        </Button>
                    </View>
                </View>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollView
                    horizontal
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    className="max-h-[600px]"
                >
                    <Table
                        aria-labelledby="invoice-table"
                        className="border-t-2 border-border"
                    >
                        <TableHeader className="sticky top-0 z-50">
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={
                                            selectedLoads.length ===
                                            loads.length
                                        }
                                        onCheckedChange={() => {}}
                                    />
                                </TableHead>
                                <TableHead className="w-[100px]">
                                    <Text>Load ID</Text>
                                </TableHead>
                                <TableHead className="w-[120px]">
                                    <Text>Status</Text>
                                </TableHead>
                                <TableHead>
                                    <Text>Origin</Text>{' '}
                                </TableHead>
                                <TableHead>
                                    <Text>Destination</Text>{' '}
                                </TableHead>
                                <TableHead>
                                    <Text>Distance</Text>{' '}
                                </TableHead>
                                <TableHead>
                                    <Text>Cargo Type</Text>{' '}
                                </TableHead>
                                <TableHead>
                                    <Text>Weight</Text>{' '}
                                </TableHead>
                                <TableHead>
                                    <Text>Deadline</Text>{' '}
                                </TableHead>
                                <TableHead>
                                    <Text>Equipment</Text>{' '}
                                </TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <FlashList
                                data={loads}
                                estimatedItemSize={100}
                                contentContainerStyle={{
                                    paddingBottom: insets.bottom,
                                }}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item: load }) => {
                                    return (
                                        <TableRow
                                            key={load.id}
                                            className={
                                                selectedLoads.includes(load.id)
                                                    ? 'bg-warn'
                                                    : ''
                                            }
                                            onPress={() =>
                                                toggleLoadSelection(load.id)
                                            }
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedLoads.includes(
                                                        load.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleLoadSelection(
                                                            load.id,
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Text>{load.id} </Text>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={load.status}
                                                />
                                            </TableCell>
                                            <TableCell>{load.origin}</TableCell>
                                            <TableCell>
                                                <Text>{load.destination} </Text>
                                            </TableCell>
                                            <TableCell>
                                                <Text>{load.distance} mi </Text>
                                            </TableCell>
                                            <TableCell>
                                                <Text>{load.cargoType} </Text>
                                            </TableCell>
                                            <TableCell>
                                                <Text>{load.weight} lbs </Text>
                                            </TableCell>
                                            <TableCell>
                                                <Text>{load.deadline} </Text>
                                            </TableCell>
                                            <TableCell>
                                                <Text> {load.equipment} </Text>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="neutral"
                                                            size="icon"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Actions
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Edit Load
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Assign Asset
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Consolidate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Cancel Load
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }}
                            />
                        </TableBody>
                    </Table>
                </ScrollView>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const getVariant = () => {
        switch (status) {
            case 'Pending':
                return 'outline';
            case 'Active':
                return 'default';
            case 'Delivered':
                return 'success';
            case 'Delayed':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <Badge variant={getVariant() as BadgeProps['variant']}>{status}</Badge>
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
