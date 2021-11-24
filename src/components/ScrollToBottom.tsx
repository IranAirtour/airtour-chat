import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Icon} from 'airtour-components';
import React, {memo} from 'react';

type IProps = {onPress: () => void};
export const ScrollToBottom = memo((props: IProps) => {
  return (
    <View style={styles.floatingBottomContainer}>
      <TouchableOpacity
        onPress={() => {
          props?.onPress?.();
        }}>
        <Icon
          containerStyle={styles.floatingBottomStyle}
          type={'material-community'}
          name="arrow-down"
          size={22}
          color={'#153D76'}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  floatingBottomContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  floatingBottomStyle: {
    backgroundColor: '#FAFCFE',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
