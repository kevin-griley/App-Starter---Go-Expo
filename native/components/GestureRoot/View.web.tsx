import * as React from 'react';
import { View } from 'react-native';

const GestureRootView: React.FC<React.PropsWithChildren> = (props) => {
    return <View style={{ flex: 1 }}>{props.children}</View>;
};

export { GestureRootView };
