import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {chatReducer} from './slices/chatSlice';
import {globalReducer} from './slices/globalSlice';
import {configureStore} from '@reduxjs/toolkit';
import {messageRepliesReducer} from './slices/messageRepliesSlice';
import {groupReducer} from './slices/groupSlice';
import {userReducer} from './slices/userSlice';
import {groupMemberReducer} from './slices/groupMemberSlice';

/**
 * reducer functionalities
 *
 *  global: uncategorized and global settings  + user own profile data, please see IGlobalReducerModel.
 *  chat: hermes messages, Chat Screen
 *  messageReplies: Message Thread screen, for handle replies of message
 *  group: group in hermes app(chat section)
 *  groupMember: group member(users) connector in hermes
 *  user: users in hermes
 *
 * we try to shape redux base on semantic and scopes
 * for example, chat reducer for chat section of airtour apps.
 *
 */
const store = configureStore({
  reducer: {
    global: globalReducer,
    chat: chatReducer,
    messageReplies: messageRepliesReducer,
    group: groupReducer,
    groupMember: groupMemberReducer,
    user: userReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
/**
 * use these hooks instead of regular hooks
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
/**
 * for usage of these hooks in components, please see Redux section in README.ms
 */
