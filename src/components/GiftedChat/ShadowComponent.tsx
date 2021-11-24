import {flatten, GlobalStyles} from 'airtour-components';
import React from 'react';
import {StyleSheet} from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';
const AnimatedView = Animated.View;

export const ShadowComponent = (props: {
  bottomSheetIsOpen: boolean;
  snapBottomSheetTo: (toValue: number) => void;
  setBottomSheetAnimatedValue: (toValue: number) => void;
  bottomSheetAnimatedValue: any;
}) => {
  const {
    snapBottomSheetTo,
    setBottomSheetAnimatedValue,
    bottomSheetIsOpen,
    bottomSheetAnimatedValue,
  } = props;

  const shadowStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(bottomSheetAnimatedValue.value, {
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  }, [bottomSheetAnimatedValue]);
  return (
    <AnimatedView
      pointerEvents={!bottomSheetIsOpen ? 'none' : 'auto'}
      style={[
        GlobalStyles.flex1,
        {
          ...StyleSheet.absoluteFillObject,
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.4)',
        },
        shadowStyle,
      ]}>
      <TouchableOpacity
        containerStyle={flatten([
          GlobalStyles.width100,
          GlobalStyles.height100,
        ])}
        onPress={() => {
          snapBottomSheetTo(0);
          setBottomSheetAnimatedValue(0);
        }}
      />
    </AnimatedView>
  );
};
