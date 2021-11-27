import React from 'react';
import {IChatContextState, IDispatch} from './payload.interface';
export const CHAT_CONTEXT_INITIAL_STATE = null;

export const ChatContext: React.Context<{
  state: IChatContextState;
  dispatch: IDispatch;
}> = React.createContext(undefined);

export function useChatContext() {
  const context = React.useContext(ChatContext);
  if (typeof context === undefined) {
    throw new Error('useChatContext must be used within a ChatContext');
  }
  return context;
}
export function useChatDispatch() {
  const context = useChatContext();
  return context.dispatch;
}
export function useChatState() {
  const context = useChatContext();
  return context.state;
}
