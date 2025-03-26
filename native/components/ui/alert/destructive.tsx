import { AlertTriangle } from '@/lib/icons/AlertTriangle';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '.';

interface AlertExampleProps {
    icon?: LucideIcon;
    title?: string;
    description: string;
}

export const AlertDestructive: React.FC<AlertExampleProps> = ({
    icon = AlertTriangle,
    title = 'Danger!',
    description,
}) => {
    return (
        <>
            <Alert icon={icon} variant="destructive" className="max-w-xl">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
            </Alert>
        </>
    );
};
