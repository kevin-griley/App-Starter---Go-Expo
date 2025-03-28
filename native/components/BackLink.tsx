import { Pressable, View } from 'react-native';

import { ChevronLeft } from '@/lib/icons/ChevronLeft';

import { cn } from '@/lib/utils';
import { Link, type LinkProps } from 'expo-router';

interface BackLinkProps {
    link: LinkProps['href'];
}

export const BackLink = ({ link }: BackLinkProps) => {
    return (
        <Link href={link} asChild>
            <Pressable className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2">
                {({ pressed }) => (
                    <View
                        className={cn(
                            'flex-1 aspect-square pt-0.5 justify-center items-start web:px-5',
                            pressed && 'opacity-70',
                        )}
                    >
                        <ChevronLeft
                            className="text-foreground"
                            size={24}
                            strokeWidth={2}
                        />
                    </View>
                )}
            </Pressable>
        </Link>
    );
};
