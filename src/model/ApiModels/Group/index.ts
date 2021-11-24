import { IServerGroupLastMessageModel } from '../Message';
import {INullableNumber, INullableString} from "../../IBase";

export interface IServerGroup {
  title: string;
  sequentialId: number;
  membersCount: INullableNumber;
  lastMessage?: IServerGroupLastMessageModel;
  lastSeenMessageId: INullableNumber;
  unSeenMessagesCount: INullableNumber;
  iconId: INullableString;
  iconHash: INullableString;
}
