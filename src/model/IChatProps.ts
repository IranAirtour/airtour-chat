import {IUserProfile} from './User/IUserProfile';
import {IUserModel} from './User';
import {IMessageModel} from './Chat/Message';
import {IGroupItem} from './Chat/Group';

export type IChatHookProvider = {
  chatInputText?: string;
  setChatTextInput?: Function;
  onSend?: Function;
  onLoadMore?: Function;
  onReplyMessageCallback?: Function;
  onRefreshCallback?: Function;
  onViewableItemsChanged?: Function;
  deleteMessageCallback?: Function;
  setReply?: Function;
  setFile?: Function;
  retrySendMessage?: Function;
};

export type IChatProps = {
  accessToken: string;
  applicationName: 'CREW' | 'TAM';
  group?: IGroupItem;
  groupId?: number;
  userProfile: IUserProfile;
  userList: IUserModel[];
  messages: IMessageModel[];
  writable: boolean;
  chatHookProvider?: IChatHookProvider;
};
