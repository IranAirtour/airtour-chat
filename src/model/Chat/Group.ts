import {INullableId, INullableNumber, INullableString} from '../IBase';
import {IUserModel} from '../User';

export interface ILastMessage {
  attachment: null;
  groupSequentialId: INullableId;
  repliedToMessage: null;
  repliedToMessageId: null;
  replyCount: INullableNumber;
  senderUserId: number;
  senderUser: IUserModel;
  sequentialId: INullableNumber;
  text: INullableString;
  type: INullableNumber;
  utcTimestamp: INullableNumber | INullableString;
  sent?: boolean;
}
export interface IGroupItem {
  _id: number;
  title: string;
  iconId: string;
  iconHash: string;
  icon: string;
  membersCount: INullableNumber;
  lastMessage?: ILastMessage | null;
  lastSeenMessageId: INullableNumber;
  unSeenMessagesCount: INullableNumber;
}
