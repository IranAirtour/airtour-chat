import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {
  Avatar,
  FontFamily,
  Text,
  flatten,
  GlobalStyles,
  useThemeColors,
  NotificationBadge,
} from 'airtour-components';
import React, {useMemo} from 'react';
import {styles} from './styles';
// import {NavHandler} from '../../../navigation/navConfig';
// import {ScreenNames} from '../../../resources/strings';
// import {hasActionPermission} from '../../../permissions/actionHandler';
// import {ActionList} from '../../../permissions/actionList';
import {useUserHook} from '../../hooks/useUserHook';
import DateTimeFormatter from 'airtour-components/src/utils/DateTimeUtils';
import {IGroupItem, ILastMessage} from '../../model/Chat/Group';

const LastMessage = (props: any) => {
  const {type = 1, text = '', userId, time, attachment} = props;
  const userMemo = useUserHook(null, userId);
  const typeIsText = Number(type) === 1;
  const typeIsFile = !!attachment && text.length === 0;
  const themeColors = useThemeColors();

  return (
    <View style={flatten([styles.info])}>
      <Text
        h8
        numberOfLines={2}
        style={StyleSheet.flatten([
          GlobalStyles.flexRow,
          GlobalStyles.leftText,
          styles.messageText,
          {
            flex: 1,
            color: typeIsFile ? '#528bbe' : '#000',
            overflow: 'hidden',
          },
        ])}>
        {userMemo?._id ? (
          <Text
            h8
            style={flatten([
              styles.username,
              {color: themeColors.primaryGray},
            ])}>
            {`${userMemo?.name || ''}: `}{' '}
          </Text>
        ) : null}
        {typeIsText ? text : ''}
        {typeIsFile ? `${attachment?.name}.${attachment?.mimeType}` : ''}
      </Text>
      <Text h9 style={styles.time}>
        {time ?? ''}
      </Text>
    </View>
  );
};
export const GroupListItem = (
  props: Partial<IGroupItem> & {onPress: (group: Partial<IGroupItem>) => void},
) => {
  const {
    _id,
    title = '',
    icon = null,
    lastMessage = null,
    unSeenMessagesCount = 0,
    lastSeenMessageId = null,
    onPress,
  } = props;
  const {
    type = 1,
    text = '',
    utcTimestamp,
    senderUserId,
    attachment,
  } = (lastMessage as ILastMessage) ?? {};
  const time = useMemo(() => {
    return DateTimeFormatter.formatTime(utcTimestamp, false);
  }, [utcTimestamp]);

  const avatarTitle = useMemo(() => {
    const titleArray = title?.split(' ');
    return (
      titleArray?.[0]?.toUpperCase?.() ||
      '' + titleArray?.[1]?.toUpperCase?.() ||
      ''
    );
  }, [title]);
  return (
    <TouchableWithoutFeedback
      onPress={() => onPress({_id, title, icon, lastSeenMessageId})}>
      <View
        nativeID={'chat_list_item_' + _id}
        style={StyleSheet.flatten([
          GlobalStyles.flexRow,
          styles.chatListRowContainer,
          GlobalStyles.width100,
        ])}>
        <View style={StyleSheet.flatten([styles.imageContainer])}>
          <Avatar
            title={avatarTitle}
            size="medium"
            borderRadius={10}
            containerStyle={styles.image}
            source={{uri: `${icon || ''}`}}
            onPress={() => onPress({_id, title, icon, lastSeenMessageId})}
            activeOpacity={0.7}
          />
        </View>
        <View
          style={StyleSheet.flatten([
            GlobalStyles.height100,
            styles.rightSide,
          ])}>
          <View
            style={StyleSheet.flatten([{height: '40%'}, GlobalStyles.flexRow])}>
            <View
              style={flatten([
                GlobalStyles.height100,
                GlobalStyles.fullCenter,
                {flex: 9},
              ])}>
              <Text
                h7
                h7Style={{fontFamily: FontFamily.NunitoBold}}
                numberOfLines={1}
                style={StyleSheet.flatten([
                  GlobalStyles.leftText,
                  GlobalStyles.noMarginXY,
                  styles.title,
                ])}>
                {title || ''}
              </Text>
            </View>
            <View
              style={flatten([
                GlobalStyles.flexEnd,
                GlobalStyles.height100,
                GlobalStyles.flex1,
              ])}>
              {unSeenMessagesCount > 0 ? (
                <NotificationBadge count={unSeenMessagesCount} />
              ) : null}
            </View>
          </View>
          <LastMessage
            user={null}
            userId={senderUserId}
            type={type}
            text={text}
            time={time}
            attachment={attachment}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
