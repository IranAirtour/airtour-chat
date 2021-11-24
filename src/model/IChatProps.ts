import {IUserProfile} from './User/IUserProfile';
import {IUserModel} from './User';

export type IChatProps = {
  accessToken: string;
  applicationName: 'CREW' | 'TAM';
  groupId?: string;
  userProfile: IUserProfile;
  userList: IUserModel[];
};
