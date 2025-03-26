import * as React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '.';
import { Button } from '../button';
import { Text } from '../text';

interface AlertDialogProps {
    trigger: string;
    title: string;
    description: string;
    cancel?: string;
    action?: string;
}

export const AlertDialogDefault: React.FC<AlertDialogProps> = ({
    trigger,
    title,
    description,
    cancel = 'Cancel',
    action = 'Continue',
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Text>{trigger}</Text>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        <Text>{cancel}</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction>
                        <Text>{action}</Text>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
