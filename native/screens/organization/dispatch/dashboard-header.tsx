import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Bell, HelpCircle, Search, Settings } from 'lucide-react-native';
import { View } from 'react-native';

export function DashboardHeader() {
    return (
        <View className="sticky top-0 z-10 border-b bg-background">
            <View className="flex flex-row h-16 items-center px-4 md:px-6">
                <View className="flex flex-row items-center gap-2 font-semibold">
                    <Text className="text-xl">Dispatch</Text>
                </View>
                <View className="ml-auto flex flex-row items-center gap-4">
                    <View className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text" />
                        <Input
                            placeholder="Search loads, assets..."
                            className="w-64 rounded-lg bg-background pl-8 md:w-80"
                        />
                    </View>
                    <Button variant="noShadow" size="icon" className="bg-error">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="noShadow" size="icon" className="bg-warn">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="noShadow" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>
                    <Button variant="neutral" size="sm">
                        <Text className="text-text">Create Dispatch</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}
