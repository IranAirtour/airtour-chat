import {IServerUserModel} from '../User';

export interface IServerGroupMemberModel {
  id: number;
  sequentialId: number;
  userSequentialId: number;
  user: IServerUserModel;
  groupSequentialId: number;
  isAdmin: boolean;
}
