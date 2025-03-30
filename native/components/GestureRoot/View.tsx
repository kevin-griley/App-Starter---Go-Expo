import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const GestureRootView: React.FC<React.PropsWithChildren> = (props) => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {props.children}
        </GestureHandlerRootView>
    );
};

export { GestureRootView };
