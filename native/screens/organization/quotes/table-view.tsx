'use client';

import { useModal } from '@/components/ModalManager/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Plus, RefreshCw } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export function TableView() {
    const { openModal, closeModal } = useModal();

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-4">
                <View className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                        Quote List
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
                            onPress={() => {
                                openModal('POST_QUOTES', {
                                    closeModal,
                                });
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4 text-mtext" />
                            <Text>Add Quote</Text>
                        </Button>
                    </View>
                </View>
            </CardHeader>
            <CardContent className="p-0"></CardContent>
        </Card>
    );
}
