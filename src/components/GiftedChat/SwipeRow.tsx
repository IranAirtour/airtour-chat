import React, {PureComponent} from 'react';
import {Animated, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {INullableBoolean} from '../../model/IBase';

class SwipeRow extends PureComponent {
  thresholdPassed: INullableBoolean = null;
  private renderRightAction = (
    x: number,
    progress: Animated.AnimatedInterpolation,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View style={{flex: 1, transform: [{translateX: trans}]}} />
    );
  };

  private renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    _dragAnimatedValue: Animated.AnimatedInterpolation,
  ) => (
    <View
      style={{
        width: '15%',
      }}>
      {this.renderRightAction(40, progress)}
    </View>
  );

  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };
  private close = () => {
    this.swipeableRow?.close();
  };
  private onSwipeableOpen = () => {
    this.close();
    if (this.props.onSwipeableOpen) {
      this.props.onSwipeableOpen();
    }
  };
  render() {
    const {children} = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={1}
        enableTrackpadTwoFingerGesture
        leftThreshold={50}
        rightThreshold={50}
        renderLeftActions={this.renderRightActions}
        renderRightActions={this.renderRightActions}
        // onSwipeableLeftOpen={this.onSwipeableOpen}
        // onSwipeableRightOpen={this.onSwipeableOpen}
        onSwipeableOpen={this.onSwipeableOpen}
        // on={this.onSwipeableOpen}
      >
        {children}
      </Swipeable>
    );
  }
}
export {SwipeRow};
