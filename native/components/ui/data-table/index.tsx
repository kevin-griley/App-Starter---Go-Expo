import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { FlashList, type FlashListProps } from '@shopify/flash-list';
import type { ColumnDef, Row, SortingState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView,
} from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowPress?: (row: Row<TData>) => void;
    estimatedItemSize?: number;
    ListEmptyComponent?: FlashListProps<TData>['ListEmptyComponent'];
    ListFooterComponent?: FlashListProps<TData>['ListFooterComponent'];
    isRefreshing?: boolean;
    onRefresh?: () => void;
}

/**
 * @docs https://tanstack.com/table
 */

export function DataTable<TData, TValue>({
    columns,
    data,
    onRowPress,
    estimatedItemSize = 45,
    ListEmptyComponent,
    ListFooterComponent,
    isRefreshing = false,
    onRefresh,
}: DataTableProps<TData, TValue>) {
    const insets = useSafeAreaInsets();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <>
            {isRefreshing && (
                <Animated.View
                    entering={FadeInUp}
                    exiting={FadeOutUp}
                    className="h-14 top-16 absolute items-center justify-center w-screen"
                >
                    <ActivityIndicator size="small" className="text-text" />
                </Animated.View>
            )}
            <ScrollView
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: getColumnWidth(
                                                    header.getSize(),
                                                    columns.length,
                                                ),
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <FlashList
                            data={table.getRowModel().rows}
                            estimatedItemSize={estimatedItemSize}
                            ListEmptyComponent={ListEmptyComponent}
                            ListFooterComponent={ListFooterComponent}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: insets.bottom,
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={onRefresh}
                                    style={{ opacity: 0 }}
                                />
                            }
                            renderItem={({ item: row, index }) => {
                                return (
                                    <TableRow
                                        className={cn(
                                            'active:opacity-70',
                                            index % 2 && 'bg-bw',
                                        )}
                                        onPress={
                                            onRowPress
                                                ? () => {
                                                      onRowPress(row);
                                                  }
                                                : undefined
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                style={{
                                                    width: getColumnWidth(
                                                        cell.column.getSize(),
                                                        columns.length,
                                                    ),
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            }}
                        />
                    </TableBody>
                </Table>
            </ScrollView>
        </>
    );
}

const { width } = Dimensions.get('window');

function getColumnWidth(size: number, length: number) {
    const evenWidth = width / length;
    return evenWidth > size ? evenWidth : size;
}
