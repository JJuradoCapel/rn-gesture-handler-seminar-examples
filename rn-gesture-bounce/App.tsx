import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const COLORS = ['#222222', '#BBCDE5', '#1C5D99', '#639FAB'];

export default function App() {
  const imagePinch = React.createRef();
  const imageRotation = React.createRef();

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const [colorIndex, setColor] = useState(0);

  const setNextColor = () => colorIndex >= COLORS.length - 1 ? setColor(0) : setColor(colorIndex + 1);

  const tapHandler = useAnimatedGestureHandler<GestureEvent<TapGestureHandlerEventPayload>>({
    onActive: () => runOnJS(setNextColor)(),
  }, [setNextColor]);

  const panHandler = useAnimatedGestureHandler<GestureEvent<PanGestureHandlerEventPayload>>({
    onActive: (e) => {
      translationX.value = e.translationX;
      translationY.value = e.translationY;
    },
    onEnd: () => {
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
    },
  });

  const ballStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX.value,
      },
      {
        translateY: translationY.value,
      }
    ],
  }));

  return (
    <View style={styles.container} pointerEvents='box-none'>
      <PanGestureHandler ref={imagePinch} onGestureEvent={panHandler}>
        <Animated.View>
          <TapGestureHandler ref={imageRotation} onGestureEvent={tapHandler} numberOfTaps={1} >
            <Animated.View style={[{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS[colorIndex] }, ballStyle]} />
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
