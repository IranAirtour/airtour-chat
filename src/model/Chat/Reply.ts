import { IUserModel } from '../User';

export interface IReplyTo {
  _id: string | number;
  message: string;
  user: IUserModel | null;
  userId?: number | null;
}

export interface IReplyModel {
  title: string;
  value: string;
  messageId: any;
  user: IUserModel | null;
  userId?: number | null;
}
export interface IQuickReplyModel {
  type: 'radio' | 'checkbox';
  values: IReplyModel[];
  keepIt?: boolean;
}
