import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowDown } from '@/lib/icons/ArrowDown';
import { ArrowUp } from '@/lib/icons/ArrowUp';
import { cn } from '@/lib/utils';
import { FlashList, type FlashListProps } from '@shopify/flash-list';
import type {
    Column,
    ColumnDef,
    Row,
    SortingState,
} from '@tanstack/react-table';
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
import { Button } from '../button';
import { Text } from '../text';

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
                    <ActivityIndicator
                        size="small"
                        className="text-foreground"
                    />
                </Animated.View>
            )}
            <ScrollView
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
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
                                            index % 2 &&
                                                'bg-zinc-100/50 dark:bg-zinc-900/50',
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

interface HeaderProps<TValue> {
    title: string;
    column: Column<TValue>;
}

export function Header<TValue>({ title, column }: HeaderProps<TValue>) {
    return (
        <Button
            onPress={() => {
                if (column.getIsSorted() === 'desc') {
                    column.clearSorting();
                    return;
                }
                column.toggleSorting(column.getIsSorted() === 'asc');
            }}
            size="sm"
            variant="ghost"
            className="flex flex-row px-0 justify-start gap-1.5 web:hover:bg-background/0 web:hover:opacity-80 active:bg-background/0"
        >
            <Text className={'font-medium text-muted-foreground'}>{title}</Text>
            {column.getIsSorted() === 'asc' ? (
                <ArrowUp size={15} className="ml-2 text-muted-foreground" />
            ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown size={15} className="ml-2 text-muted-foreground" />
            ) : null}
        </Button>
    );
}
