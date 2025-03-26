import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '.';
import { Text } from '../text';

interface AvatarExampleProps {
    uri: string;
    fallback: string;
    alt: string;
}

export const AvatarDefault: React.FC<AvatarExampleProps> = ({
    uri,
    fallback,
    alt,
}) => {
    return (
        <Avatar alt={alt}>
            <AvatarImage source={{ uri }} />
            <AvatarFallback>
                <Text>{fallback}</Text>
            </AvatarFallback>
        </Avatar>
    );
};
