import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Bell } from '@/lib/icons/Bell';
import { HelpCircle } from '@/lib/icons/HelpCircle';
import { Plus } from '@/lib/icons/Plus';
import { Search } from '@/lib/icons/Search';
import { Settings } from '@/lib/icons/Settings';
import { View } from 'react-native';

export function DispatchHeader() {
    return (
        <View className="flex flex-row items-center gap-4 mr-4">
            <View className="relative hidden lg:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text" />
                <Input
                    placeholder="Search loads, assets..."
                    className="w-64 rounded-base bg-background pl-8 md:w-80"
                />
            </View>
            <View className="relative hidden sm:block">
                <View className="flex flex-row items-center gap-4">
                    <Button variant="noShadow" size="icon" className="bg-error">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="noShadow" size="icon" className="bg-warn">
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="noShadow" size="icon" className="">
                        <Settings className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="noShadow"
                        size="sm"
                        className="bg-bw flex flex-row gap-x-2"
                    >
                        <Plus className="h-5 w-5 text-text" />
                        <Text className="text-text">Create New</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}
