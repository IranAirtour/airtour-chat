import {Bubble} from './Bubble';
import React, {memo} from 'react';
import {IGroupItem} from '../model/Chat/Group';

export const renderBubble = (
  props: any,
  onReplyMessage: Function,
  group: IGroupItem,
) => {
  return <Bubble {...props} onReply={onReplyMessage} group={group} />;
};

export const RenderBubble = memo((props: any) => {
  return <Bubble {...props} />;
});
