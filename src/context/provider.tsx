import React from 'react';
import {useReducer} from 'react';
import {ChatContext, CHAT_CONTEXT_INITIAL_STATE} from './chatContext';
import {chatReducer} from './reducer';

export const ChatProvider = (props: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(chatReducer, CHAT_CONTEXT_INITIAL_STATE);
  const value = {state, dispatch};
  return (
    <ChatContext.Provider value={value}>
      {props.children ?? null}
    </ChatContext.Provider>
  );
};
