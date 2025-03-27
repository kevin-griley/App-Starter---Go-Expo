import * as React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '.';
import { Button } from '../button';
import { Text } from '../text';

interface DialogExampleProps {
    trigger: string;
    title: string;
    description: string;
    buttonText: string;
}

export const DialogExample: React.FC<DialogExampleProps> = ({
    trigger,
    title,
    description,
    buttonText,
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Text>{trigger}</Text>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>
                            <Text>{buttonText}</Text>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
