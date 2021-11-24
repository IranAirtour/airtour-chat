import { IFileModel } from './File';
import { IReplyTo } from './Reply';
import { IServerAttachment } from '../ApiModels/Message';
import { IUserModel } from '../User';
import {INullableNumber} from "../IBase";

export interface IMessage {
  _id: number | string;
  tempId?: number | string;
  groupId: number;
  taskId?: string | null;
  text: string;
  type: 1 | 2;
  createdAt: Date | number | string;
  user: IUserModel | null;
  userId?: number | null;
  image?: string | null;
  video?: string | null;
  file?: IFileModel | null;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  replyTo?: IReplyTo | null;
  replyToId?: number | null;
  replyCount?: number;
  attachment?: IServerAttachment | null;
  index: INullableNumber;
}
export interface IMessageModel extends IMessage {}
