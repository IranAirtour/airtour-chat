import React, {memo} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {styles} from './styles';
import {Text, flatten} from 'airtour-components';
import {IUserProfile} from '../../model/User/IUserProfile';
import {IMessageModel} from '../../model/Chat/Message';
import {useUserHook} from '../../hooks/useUserHook';

export type IMessageReplyProps = {
  currentMessage: IMessageModel;
  userProfile: IUserProfile;
  scrollToMessage?: any;
  position: 'left' | 'right';
  containerStyle?: StyleProp<ViewStyle>;
};

const MessageReplay = memo((props: IMessageReplyProps) => {
  const {
    currentMessage,
    userProfile,
    scrollToMessage = null,
    position = 'left',
    containerStyle,
  } = props;
  const {replyTo} = currentMessage ?? {};
  const {user: replyToUser, userId, message} = replyTo ?? {};
  const userMemo = useUserHook(null, userId);
  // const userProfile: IUserProfile | null = useAppSelector(
  //   state => state.global.userProfile,
  // );
  const isMyUser = userMemo?._id === userProfile?._id;
  const isLeftSide = position === 'left';
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (scrollToMessage) {
          scrollToMessage(currentMessage);
        }
      }}>
      <View style={flatten([styles.container, containerStyle])}>
        <View style={{padding: 5}}>
          <View
            style={{
              backgroundColor: isLeftSide
                ? 'rgba(198,196,196,0.15)'
                : 'rgba(250, 252, 254, 0.15)',
              borderRadius: 5,
              marginTop: 4,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Indicator color={isMyUser ? '#e9e9e9' : '#6FA7DA'} />
              <View style={{flex: 1, paddingVertical: 3}}>
                <Text
                  style={StyleSheet.flatten([
                    styles.username,
                    {color: isLeftSide ? '#2d2c2c' : '#9751F0'},
                  ])}>
                  {replyToUser?.name || ''}
                </Text>
                <Text
                  numberOfLines={1}
                  style={StyleSheet.flatten([
                    styles.replyTextStyle,
                    {color: isLeftSide ? '#181818' : '#FFFFFF'},
                  ])}>
                  {message || ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const Indicator = memo((props: any) => {
  const {color} = props;
  return (
    <View
      style={StyleSheet.flatten([
        styles.indicatorStyle,
        {backgroundColor: color},
      ])}
    />
  );
});

export default MessageReplay;
