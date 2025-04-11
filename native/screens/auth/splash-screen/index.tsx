import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { H1, H2, P } from '@/components/ui/typography';
import { Link, Stack } from 'expo-router';
import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Clients } from './clients';
import { Contact } from './contact';
import { Header, solutions } from './header';

const SplashScreenWithLeftBackground = () => {
    const scrollViewRef =
        React.useRef<React.ElementRef<typeof ScrollView>>(null);

    const solutionsRef = React.useRef<React.ElementRef<typeof View>>(null);

    const scrollToSolutions = () => {
        setTimeout(() => {
            solutionsRef.current?.measureInWindow((_x, y) => {
                scrollViewRef.current?.scrollTo({
                    y: y - 100,
                    animated: true,
                });
            });
        }, 100);
    };

    const contactRef = React.useRef<React.ElementRef<typeof View>>(null);

    const scrollToContact = () => {
        setTimeout(() => {
            contactRef.current?.measureInWindow((_x, y) => {
                scrollViewRef.current?.scrollTo({
                    y: y - 100,
                    animated: true,
                });
            });
        }, 100);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <ScrollView
                ref={scrollViewRef}
                className="flex min-h-full flex-col bg-black"
            >
                <View className="absolute top-2 right-0 left-0 z-40 pt-14">
                    <Header
                        scrollToSolutions={scrollToSolutions}
                        scrollToContact={scrollToContact}
                    />
                </View>
                <View className="h-2 relative z-50" />
                <View
                    className="relative flex flex-auto bg-white pt-14 "
                    style={{
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                    }}
                >
                    <View className="w-full flex-auto ">
                        <View className="mt-24 sm:mt-32 md:mt-56 max-w-7xl self-center w-full">
                            <View className="max-w-3xl px-10">
                                <H1 className="pt-1 text-5xl [text-wrap:balance] sm:text-7xl text-mtext">
                                    Track smarter. Expand further.
                                </H1>

                                <P className="mt-6 text-xl text-mtext">
                                    Know where every ULD lives — and never lose
                                    one again.
                                </P>
                                <View className="mt-8 flex flex-row gap-x-4 justify-center sm:justify-start">
                                    <Link href="/sign-up" asChild>
                                        <Button
                                            variant="noShadow"
                                            className="bg-warn"
                                        >
                                            <Text> Join free </Text>
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="noShadow"
                                        className="bg-white"
                                        onPress={() => {
                                            scrollToContact();
                                        }}
                                    >
                                        <Text> Contact Us </Text>
                                    </Button>
                                </View>
                            </View>

                            <View className="absolute right-10 -top-16 -z-10 hidden h-full w-full max-w-[50%] lg:block">
                                <Image
                                    alt="UnitLoadDevice"
                                    // eslint-disable-next-line @typescript-eslint/no-require-imports
                                    source={require('@/assets/images/unit-load-device.jpeg')}
                                    style={{
                                        height: 458,
                                        width: 612,
                                        objectFit: 'cover',
                                    }}
                                />
                            </View>
                        </View>

                        <View
                            className="mt-24 bg-black pt-20 sm:mt-32 sm:pt-32 lg:mt-56"
                            style={{
                                borderTopLeftRadius: 40,
                                borderTopRightRadius: 40,
                            }}
                        >
                            <Clients />

                            <View
                                className="mt-24 bg-white py-20 sm:mt-32 sm:py-32 lg:mt-56 "
                                style={{
                                    borderTopLeftRadius: 40,
                                    borderTopRightRadius: 40,
                                }}
                            >
                                <View className="max-w-7xl self-center w-full">
                                    <H2 className="mb-10 text-mtext font-semibold px-10">
                                        Expanding Solutions for every move.
                                    </H2>

                                    <View
                                        ref={solutionsRef}
                                        className="flex flex-row flex-wrap px-10 gap-10"
                                    >
                                        {solutions.map((component, idx) => (
                                            <Card
                                                key={`${component.title}-${idx}`}
                                                className="w-full md:w-[calc(50%-1.75rem)]"
                                            >
                                                <CardHeader>
                                                    <CardTitle>
                                                        {component.title}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {component.description}
                                                    </CardDescription>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            <View
                                ref={contactRef}
                                className="bg-white p-4 md:p-8 flex items-center justify-center"
                            >
                                <Contact />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

export const SplashScreen = () => {
    return <SplashScreenWithLeftBackground />;
};
