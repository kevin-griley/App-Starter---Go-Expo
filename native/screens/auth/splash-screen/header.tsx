import { Button } from '@/components/ui/button';
import { H4, P } from '@/components/ui/typography';
import type * as DropDownPrimative from '@rn-primitives/dropdown-menu';
import { Link } from 'expo-router';

import { Pressable, View } from 'react-native';

import { Expand } from '@/lib/icons/Expand';
import { Menu } from '@/lib/icons/Menu';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const solutions: {
    title: string;
    description: string;
}[] = [
    {
        title: 'Inventory Your ULDs',
        description:
            'See what is in your warehouse at a glance. Scan, search, and update ULD status in real-time.',
    },
    {
        title: 'Track ULD Movement (LFD)',
        description:
            'Log Last Free Day, get notified before charges hit, and keep freight flowing without surprise fees.',
    },
    {
        title: 'Create Delivery Manifests',
        description:
            'Generate clear, trackable delivery manifests to document every handoff and confirm deliveries.',
    },
    {
        title: 'Cross Platform Integration',
        description:
            'Web, iOS, and Android apps to track ULDs and deliveries on the go.',
    },
];

interface HeaderProps {
    scrollToSolutions: () => void;
    scrollToContact: () => void;
}

export function Header({ scrollToContact, scrollToSolutions }: HeaderProps) {
    const triggerRef =
        React.useRef<React.ElementRef<typeof DropDownPrimative.Trigger>>(null);

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    return (
        <>
            <View className="flex flex-row items-center justify-between px-6 max-w-7xl self-center w-full">
                <View className="flex flex-row items-center gap-x-8">
                    <Link href="/" aria-label="Home" asChild>
                        <View className="flex flex-row items-center">
                            <H4 className="text-mtext"> FLEETEXPAND </H4>
                            <Expand className="h-5 w-5 text-mtext" />
                        </View>
                    </Link>

                    <NavigationMenuDemo
                        scrollToSolutions={scrollToSolutions}
                        scrollToContact={scrollToContact}
                    />
                </View>

                <View className="flex flex-row items-center gap-x-4">
                    <Link href="/sign-in" asChild>
                        <Button
                            variant="noShadow"
                            className="hidden md:block bg-purple-400"
                        >
                            <Text>Log In</Text>
                        </Button>
                    </Link>

                    <DropdownMenu>
                        <Button
                            variant="noShadow"
                            className="bg-success"
                            onPress={() => {
                                triggerRef.current?.open();
                            }}
                        >
                            <Menu className="h-5 w-5 text-mtext" />
                        </Button>
                        <DropdownMenuTrigger ref={triggerRef} />
                        <DropdownMenuContent
                            insets={contentInsets}
                            className="w-64 native:w-72 web:m-2"
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onPress={() => {
                                        triggerRef.current?.close();
                                    }}
                                    asChild
                                >
                                    <Link href="/sign-in" asChild>
                                        <Text>Sign In</Text>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onPress={() => {
                                        triggerRef.current?.close();
                                    }}
                                    asChild
                                >
                                    <Link href="/sign-up" asChild>
                                        <Text>Sign Up</Text>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onPress={() => {
                                        triggerRef.current?.close();
                                    }}
                                    asChild
                                >
                                    <Link
                                        href={
                                            'https://api.fleetexpand.com/docs'
                                        }
                                        asChild
                                    >
                                        <Text>API Docs</Text>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onPress={() => {
                                        scrollToSolutions();
                                        triggerRef.current?.close();
                                    }}
                                    closeOnPress={false}
                                    asChild
                                >
                                    <Link href={'..'} asChild>
                                        <Text>Solutions</Text>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onPress={() => {
                                        scrollToContact();
                                        triggerRef.current?.close();
                                    }}
                                    closeOnPress={false}
                                    asChild
                                >
                                    <Link href={'..'} asChild>
                                        <Text>Contact Us</Text>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </View>
            </View>
        </>
    );
}

export default function NavigationMenuDemo({ scrollToSolutions }: HeaderProps) {
    const [value, setValue] = React.useState<string>();

    return (
        <NavigationMenu
            className="hidden md:block z-[5] m750:max-w-[300px]"
            value={value}
            onValueChange={setValue}
        >
            <NavigationMenuList className="m750:max-w-[300px]">
                <NavigationMenuItem value="Solutions">
                    <NavigationMenuTrigger className="m750:max-w-[80px] m750:text-xs">
                        <Text className="text-mtext">Solutions</Text>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <View className="flex flex-row flex-wrap w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px]">
                            {solutions.map((component, idx) => (
                                <ListItem
                                    key={`${component.title}-${idx}`}
                                    className="w-full md:w-[calc(50%-0.375rem)]"
                                    title={component.title}
                                    onPress={scrollToSolutions}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </View>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem value="Resources">
                    <Link asChild href={'https://api.fleetexpand.com/docs'}>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            <Text className="m750:max-w-[80px] m750:text-xs text-mtext">
                                API Docs
                            </Text>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
interface ListItemProps {
    className?: string;
    title: string;
    children: string;
    onPress: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
    className,
    title,
    onPress,
    children,
}) => {
    return (
        <NavigationMenuLink asChild>
            <Pressable
                onPress={onPress}
                className={cn(
                    'select-none space-y-1 rounded-base border-2 border-transparent p-3 leading-none no-underline outline-none transition-colors hover:border-border',
                    className,
                )}
            >
                <View className="flex flex-col">
                    <H4 className="text-mtext text-base leading-none font-semibold border-b-2 border-border pb-1">
                        {title}
                    </H4>
                    <P className="text-mtext font-base text-sm leading-snug">
                        {children}
                    </P>
                </View>
            </Pressable>
        </NavigationMenuLink>
    );
};
