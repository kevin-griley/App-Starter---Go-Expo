import * as React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '.';
import { Text } from '../text';

interface AccordionExampleProps {
    dafaultValue: string[];
    items: {
        value: string;
        trigger: string;
        content: string;
    }[];
}

export const AccordionDefault: React.FC<AccordionExampleProps> = ({
    dafaultValue,
    items,
}) => {
    return (
        <Accordion
            type="multiple"
            collapsible
            defaultValue={dafaultValue}
            className="w-full max-w-sm native:max-w-md"
        >
            {items.map((item) => (
                <AccordionItem value={item.value} key={item.value}>
                    <AccordionTrigger>
                        <Text>{item.trigger}</Text>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Text>{item.value}</Text>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
