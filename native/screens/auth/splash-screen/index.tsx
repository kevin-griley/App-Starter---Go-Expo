import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AuthLayout } from '../layout';

const SplashScreenWithLeftBackground = () => {
    return (
        <VStack
            className="w-full max-w-[440px] items-center h-full justify-center"
            space="lg"
        >
            <VStack className="w-full" space="lg">
                <Button className="w-full" onPress={() => {}}>
                    <Text className="font-medium">Log in</Text>
                </Button>
                <Button onPress={() => {}}>
                    <Text className="font-medium">Sign Up</Text>
                </Button>
            </VStack>
        </VStack>
    );
};

export const SplashScreen = () => {
    return (
        <AuthLayout>
            <SplashScreenWithLeftBackground />
        </AuthLayout>
    );
};
