import {IUserProfile} from './User/IUserProfile';
import {IUserModel} from './User';
import {IMessageModel} from './Chat/Message';

export type IChatProps = {
  accessToken: string;
  applicationName: 'CREW' | 'TAM';
  groupId?: string;
  userProfile: IUserProfile;
  userList: IUserModel[];
  messages: IMessageModel[];
  writable: boolean;
};
