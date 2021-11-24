import {INullableDate, INullableId, INullableNumber, INullableString} from "../../IBase";

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
}
