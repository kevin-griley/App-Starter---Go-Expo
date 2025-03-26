import * as React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '.';
import { Text } from '../text';

interface CardDefaultProps {
    title: string;
    description: string;
    content: string;
    footer: string;
}

export const CardDefault: React.FC<CardDefaultProps> = ({
    title,
    description,
    content,
    footer,
}) => {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Text>{content}</Text>
            </CardContent>
            <CardFooter>
                <Text>{footer}</Text>
            </CardFooter>
        </Card>
    );
};
