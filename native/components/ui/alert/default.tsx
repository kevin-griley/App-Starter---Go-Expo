import { Terminal } from '@/lib/icons/Terminal';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '.';

interface AlertExampleProps {
    icon?: LucideIcon;
    title?: string;
    description: string;
}

export const AlertDefault: React.FC<AlertExampleProps> = ({
    icon = Terminal,
    title = 'Heads up!',
    description,
}) => {
    return (
        <>
            <Alert icon={icon} className="max-w-xl">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
            </Alert>
        </>
    );
};
