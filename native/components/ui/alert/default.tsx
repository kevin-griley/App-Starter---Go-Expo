import { Terminal } from '@/lib/icons/Terminal';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import type { AlertProps } from '.';
import { Alert, AlertDescription, AlertTitle } from '.';

interface AlertExampleProps {
    icon?: LucideIcon;
    title?: string;
    description: React.ReactNode;
    variant?: AlertProps['variant'];
}

export const AlertDefault: React.FC<AlertExampleProps> = ({
    icon = Terminal,
    title = 'Heads up!',
    description,
    variant = 'default',
}) => {
    return (
        <>
            <Alert icon={icon} className="max-w-xl" variant={variant}>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
            </Alert>
        </>
    );
};
