import {IUserProfile} from './User/IUserProfile';
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

export type INavigateToThreadParams = {
  message?: IMessageModel;
  group: IGroupItem;
  writable?: boolean;
};

export type IChatProps = {
  applicationName: 'CREW' | 'TAM';
  group?: IGroupItem;
  userProfile: IUserProfile;
  messages: IMessageModel[];
  writable: boolean;
  chatHookProvider?: IChatHookProvider;
  keysPrefix?: string;
  isThread?: boolean;
  onNavigateToThread?: (params: INavigateToThreadParams) => void;
};
