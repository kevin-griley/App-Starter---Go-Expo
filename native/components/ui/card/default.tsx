import * as React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '.';

interface CardDefaultProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    content: React.ReactNode;
    footer?: React.ReactNode;
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
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>{content}</CardContent>
            {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
    );
};
