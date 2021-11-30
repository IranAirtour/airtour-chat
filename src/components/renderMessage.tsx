import Message from './Message/Message';
import React, {useMemo} from 'react';
import emojiUtils from 'emoji-utils';
import {emojiStyles} from './emojiStyles';
import {IMessageModel} from '../model/Chat/Message';
import {IUserProfile} from '../model/User/IUserProfile';

export type IRenderMessageType = {
  user: IUserProfile;
  currentMessage: IMessageModel;
  retrySendMessage: any;
};
export const RenderMessage = (props: IRenderMessageType) => {
  const {
    currentMessage: {text: currText, userId: userId},
    user: userProfile,
    retrySendMessage,
  } = props;

  const isMyUser = userId === userProfile?._id;
  // Make "pure emoji" messages much bigger than plain text.
  const messageTextStyle = useMemo(() => {
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      return emojiStyles.pureEmoji;
    }
    return {};
  }, [currText]);
  return (
    <Message
      {...props}
      messageTextStyle={messageTextStyle}
      position={isMyUser ? 'right' : 'left'}
      retrySendMessage={retrySendMessage}
    />
  );
};
export function parsePatterns(linkStyle) {
  return [
    {type: 'phone', style: linkStyle, onPress: () => {}},
    {
      pattern: /#(\w+)/,
      style: {...linkStyle, color: 'rgba(29,115,208,0.62)'},
      onPress: () => {},
    },
  ];
}
