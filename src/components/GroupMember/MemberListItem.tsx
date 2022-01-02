import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {GlobalStyles} from 'airtour-components/src/components/globalStyles';
import {Text, Avatar} from 'airtour-components';
import React, {useCallback, useMemo} from 'react';
import {styles} from './styles';
import {useUserHook} from '../../hooks/useUserHook';

export const MemberListItem = (props: any) => {
  const {_id = '', userSequentialId, user} = props;
  const {name, firstName = '', lastName = '', image = ''} = user ?? {};
  const fullName = `${name || ''}`;
  const role = '';
  const onPressCallBack = useCallback(() => {
    // NavHandler.push({
    //   name: ScreenNames.OthersProfile,
    //   params: { userId: userSequentialId },
    // });
  }, [userSequentialId]);
  const titleMemo = useMemo(() => {
    return `${firstName?.[0]?.toUpperCase?.() || ''}${
      lastName?.[0]?.toUpperCase?.() || ''
    }`;
  }, [firstName, lastName]);
  return (
    <TouchableWithoutFeedback onPress={onPressCallBack}>
      <View
        nativeID={'group_member_list_item_' + _id}
        style={StyleSheet.flatten([
          GlobalStyles.flexRow,
          styles.groupMemberListRowContainer,
        ])}>
        <View style={StyleSheet.flatten([styles.imageContainer])}>
          <Avatar
            title={titleMemo}
            size="medium"
            borderRadius={4}
            containerStyle={styles.image}
            source={image?.length ? {uri: `${image}`} : null}
            onPress={() => onPressCallBack()}
            activeOpacity={0.7}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text h8 numberOfLines={1} style={styles.username}>
            {fullName || ''}
          </Text>
          <Text h9 numberOfLines={1} style={styles.roll}>
            {role || ''}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
