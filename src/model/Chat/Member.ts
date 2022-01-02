import {IUserModel} from '../User';

export interface IGroupMemberModel {
  id: number;
  sequentialId: number;
  userSequentialId: number;
  user: IUserModel;
  groupSequentialId: number;
  isAdmin: boolean;
}
