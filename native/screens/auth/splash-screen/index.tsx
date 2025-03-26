import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { H4 } from '@/components/ui/typography';
import { VStack } from '@/components/ui/vstack';
import { Link } from 'expo-router';
import { AuthLayout } from '../layout';

const SplashScreenWithLeftBackground = () => {
    return (
        <VStack
            className="w-full max-w-[440px] items-center h-full justify-center"
            space="lg"
        >
            <H4>Welcome to **Company**</H4>

            <VStack className="w-full" space="lg">
                <Link href="/auth/sign-in">
                    <Button className="w-full" onPress={() => {}}>
                        <Text>Log in</Text>
                    </Button>
                </Link>
                <Link href="/auth/sign-up">
                    <Button className="w-full" onPress={() => {}}>
                        <Text>Sign Up</Text>
                    </Button>
                </Link>
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
