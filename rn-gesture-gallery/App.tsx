import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import {
  GestureEvent, PinchGestureHandler, PinchGestureHandlerEventPayload,
  RotationGestureHandler,
  RotationGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {useAnimatedGestureHandler, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

import Placeholder from './assets/image.png';

export default function App() {
  const imagePinch = React.createRef();
  const imageRotation = React.createRef();

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const rotationHandler = useAnimatedGestureHandler<GestureEvent<RotationGestureHandlerEventPayload>, { initialRotation: number }>({
    onStart: (_, ctx) => {
      ctx.initialRotation = rotation.value;
    },
    onActive: (e, ctx) => {
      rotation.value = e.rotation + ctx.initialRotation;
    },
  });

  const pinchHandler = useAnimatedGestureHandler<GestureEvent<PinchGestureHandlerEventPayload>, { initialScale: number }>({
    onStart: (_, ctx) => {
      ctx.initialScale = scale.value;
    },
    onActive: (e, ctx) => {
      scale.value = ctx.initialScale * e.scale;
    },
  });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}rad`,
      },
      {
        scale: scale.value,
      }
    ],
  }));

  return (
    <View style={styles.container}>
      <PinchGestureHandler ref={imagePinch} simultaneousHandlers={imageRotation} onGestureEvent={pinchHandler}>
        <Animated.View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
          <RotationGestureHandler ref={imageRotation} simultaneousHandlers={imagePinch} onGestureEvent={rotationHandler}>
            <Animated.View style={[{ width: '100%' }, imageStyle]}>
              <Image source={Placeholder} style={{ width: '100%' }} />
            </Animated.View>
          </RotationGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
