import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import React, {memo, useRef} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import LottieView from 'lottie-react-native';

export const RecordAudio = memo(() => {
  const lottieRef = useRef(null);
  const scale = useSharedValue(1);

  const animatedScaleTranslateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scale.value},
        {
          translateY: interpolate(scale.value, [1, 1.5], [0, -50]),
        },
      ],
    };
  });
  const x = useSharedValue(0);

  // const gestureHandler = useAnimatedGestureHandler({
  //   onStart: (_, ctx) => {
  //     ctx.startX = x.value;
  //   },
  //   onActive: (event, ctx) => {
  //     x.value = ctx.startX + event.translationX;
  //   },
  //   onEnd: _ => {
  //     x.value = withSpring(0);
  //   },
  // });

  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });
  return (
    <View
      style={{
        width: 42,
        height: 42,
      }}>
      <Animated.View
        style={[
          {
            width: 42,
            height: 42,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'blue',
            alignSelf: 'center',
            right: 0,
            position: 'absolute',
          },
          animatedScaleStyle,
        ]}>
        <LottieView
          autoPlay={true}
          loop={true}
          ref={lottieRef}
          source={require('../../../../assets/animations/record_pink.json')}
        />
      </Animated.View>
      <TouchableWithoutFeedback
        onPress={() => {
          // alert('kkk');
          // scale.value = withSpring(1);
          scale.value = withSpring(1.5);
        }}>
        <View>
          <Animated.View
            style={[
              {
                width: 33,
                height: 33,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
              },
              animatedScaleTranslateStyle,
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
});
