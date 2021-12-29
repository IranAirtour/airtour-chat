import {
  INullableDate,
  INullableId,
  INullableNumber,
  INullableString,
} from '../../IBase';
import {IUserModel} from '../../User';
import {IServerUserModel} from '../User';

export interface IServerRepliedToMessage {
  senderUserId: number;
  replyCount: number;
  groupSequentialId: number;
  utcTimestamp: number;
  sequentialId: number;
  repliedToMessage?: any;
  type: number;
  text: string;
  attachment: IServerAttachment | null;
  repliedToMessageId: number;
}
export interface IServerAttachment {
  id: INullableId;
  thumbnailUrl?: INullableString;
  mimeType: INullableString;
  name: INullableString;
  hash: INullableString;
  size: INullableNumber;
  messageSequentialId: INullableId;
  senderUserId: INullableId;
  sentDate: INullableDate;
  extension?: string;
}
export interface IServerMessageModel {
  senderUserId: number;
  senderUser: IUserModel;
  replyCount: number;
  groupSequentialId: number;
  utcTimestamp: number;
  sequentialId: number;
  repliedToMessage?: IServerRepliedToMessage | null;
  type: 1 | 2;
  text: string;
  repliedToMessageId: INullableNumber;
  attachment: IServerAttachment | null;
}

export interface IServerGroupLastMessageModel {
  attachment: null;
  groupSequentialId: INullableId;
  repliedToMessage: null;
  repliedToMessageId: null;
  replyCount: INullableNumber;
  senderUserId: number;
  senderUser: IServerUserModel;
  sequentialId: INullableNumber;
  text: INullableString;
  type: INullableNumber;
  utcTimestamp: INullableNumber;
}
