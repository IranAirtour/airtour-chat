import React, {memo} from 'react';
import {
  BottomSheetButton,
  Text,
  flatten,
  GlobalStyles,
} from 'airtour-components';
import {StyleSheet, View} from 'react-native';
import {colors} from 'airtour-components/src/resources/colors';

export const BottomSheetContent = memo((props: any) => {
  const {onReply, onCopy, onDelete, onCancel} = props;
  return (
    <View
      style={flatten([
        GlobalStyles.width100,
        {
          backgroundColor: colors.white,
          height: 140,
          paddingHorizontal: 10,
          paddingVertical: 10,
        },
      ])}>
      <BottomSheetButton style={styles.btn} onPress={onReply}>
        <Text style={styles.title}>Reply</Text>
      </BottomSheetButton>
      <BottomSheetButton style={styles.btn} onPress={onCopy}>
        <Text style={styles.title}>Copy Text</Text>
      </BottomSheetButton>
      {/*<Button*/}
      {/*  title={'Delete'}*/}
      {/*  containerStyle={styles.btn}*/}
      {/*  titleStyle={styles.title}*/}
      {/*  TouchableComponent={TouchableComponent}*/}
      {/*  onPress={onDelete}*/}
      {/*/>*/}
      <BottomSheetButton style={styles.btn} onPress={onCancel}>
        <Text style={styles.title}>Cancel</Text>
      </BottomSheetButton>
    </View>
  );
});

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 40,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 30,
    marginBottom: 1,
  },
  title: {
    color: '#242424',
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 10,
  },
});
