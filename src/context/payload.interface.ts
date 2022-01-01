import {IActionTypes, IPayloadTypes} from './types';

export type IDispatch = (action: IAction) => void;
export type IAction = {
  type: IActionTypes;
  payload: IPayloadTypes;
};

export type IChatContextState = {
  chatInputText?: string;
  setChatTextInput: Function;
  onSend: Function;
  onLoadMore: Function;
  onReplyMessageCallback: Function;
  onRefreshCallback: Function;
  onViewableItemsChanged: Function;
  setReply: Function;
  setFile: Function;
  retrySendMessage: Function;
};

export type IChatReplyContextPayload = {
  id: number | string;
  title?: string;
};
