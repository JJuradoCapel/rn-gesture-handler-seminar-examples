import React, { useState } from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedGestureHandler, useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue, withDecay,
} from 'react-native-reanimated';
import {SafeAreaView} from "react-native-safe-area-context";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {
  const imagePinch = React.createRef();

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const panHandler = useAnimatedGestureHandler<GestureEvent<PanGestureHandlerEventPayload>, { initialPositionX: number; initialPositionY: number }>({
    onStart: (_, ctx) => {
      ctx.initialPositionX = translationX.value;
      ctx.initialPositionY = translationY.value;
    },
    onActive: (e, ctx) => {
      translationX.value = e.translationX + ctx.initialPositionX;
      translationY.value = e.translationY + ctx.initialPositionY;
    },
    onEnd: (e) => {
      translationX.value = withDecay({ velocity: e.velocityX });
      translationY.value = withDecay({ velocity: e.velocityY });
    },
  });

  useAnimatedReaction(() => ({ x: translationX.value, y: translationY.value }), (result) => {
    if (result.x <= -((windowWidth / 2) - 35)) {
      cancelAnimation(translationX)
      translationX.value = -((windowWidth / 2) - 35);
    } else if (result.x >= ((windowWidth / 2) - 35)) {
      cancelAnimation(translationX)
      translationX.value = ((windowWidth / 2) - 35);
    }
    if (result.y <= -((windowHeight / 2) - 35)) {
      cancelAnimation(translationY)
      translationY.value = -((windowHeight / 2) - 35);
    } else if (result.y >= ((windowHeight / 2) - 35)) {
      cancelAnimation(translationY)
      translationY.value = ((windowHeight / 2) - 35);
    }
  })

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container} pointerEvents='box-none'>
        <PanGestureHandler ref={imagePinch} onGestureEvent={panHandler}>
          <Animated.View style={[{ width: 30, height: 30, borderRadius: 15, backgroundColor: 'white' }, ballStyle]} />
        </PanGestureHandler>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#558564',
    borderColor: '#564946',
    borderWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
