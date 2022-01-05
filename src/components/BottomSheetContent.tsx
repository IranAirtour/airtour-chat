import React, {memo} from 'react';
import {
  BottomSheetButton,
  Text,
  Icon,
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
          height: 100,
          paddingHorizontal: 10,
          paddingVertical: 10,
        },
      ])}>
      <BottomSheetButton style={styles.btn} onPress={onReply}>
        <View style={flatten([GlobalStyles.flexRow, GlobalStyles.fullCenter])}>
          <Icon name={'reply'} type={'material'} />
          <Text style={styles.title}>Reply</Text>
        </View>
      </BottomSheetButton>
      <BottomSheetButton style={styles.btn} onPress={onCopy}>
        <View style={flatten([GlobalStyles.flexRow, GlobalStyles.fullCenter])}>
          <Icon name={'copy-outline'} type={'ionicon'} />
          <Text style={styles.title}>Copy Text</Text>
        </View>
      </BottomSheetButton>
      {/*<Button*/}
      {/*  title={'Delete'}*/}
      {/*  containerStyle={styles.btn}*/}
      {/*  titleStyle={styles.title}*/}
      {/*  TouchableComponent={TouchableComponent}*/}
      {/*  onPress={onDelete}*/}
      {/*/>*/}
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
