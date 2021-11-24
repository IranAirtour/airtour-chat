import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {REDUCER_NAMES} from '../contants';
import {selectById, sortComparerById} from 'airtour-components/src/utils/Other';
import {RootState} from '../store';
import moment from 'moment';
import {IMessageModel} from '../../model/Chat/Message';

export const messageRepliesAdapter = createEntityAdapter<IMessageModel>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: selectById,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: sortComparerById,
});

export const messageRepliesSlice = createSlice({
  name: REDUCER_NAMES.messageReplies,
  initialState: messageRepliesAdapter.getInitialState({
    loading: 'idle',
  }),
  reducers: {
    resetMessageReplies: state => {
      state.ids = [];
      state.entities = {};
    },
    messageRepliesLoadingStarted(state) {
      // Can update the additional state field
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
    messageRepliesAdded: messageRepliesAdapter.addOne,

    messageRepliesReceived(state, action) {
      messageRepliesAdapter.upsertMany(state, action.payload.list);
      state.loading = 'idle';
    },
    messageRepliesUpdated: messageRepliesAdapter.updateOne,
    replyTempMessage: (state, action) => {
      const replyMessage = {
        ...action.payload.replyMessage,
        replyTo: null,
        createdAt: moment().unix(),
        sent: false,
      };
      messageRepliesAdapter.addOne(state, replyMessage);
    },
    replyMessage: (state, action) => {
      const id = action.payload.replyMessage?.tempId;
      const tempMessageExist: boolean = state.ids.includes(id);
      const replyMessage = {
        ...action.payload.replyMessage,
        replyTo: null,
        tempId: null,
        taskId: null,
        createdAt: moment().unix(),
        sent: true,
      };
      if (tempMessageExist) {
        messageRepliesAdapter.updateOne(state, {
          id,
          changes: {
            ...replyMessage,
            _id: action.payload.replyMessage?._id,
          },
        });
      } else {
        messageRepliesAdapter.addOne(state, replyMessage);
      }
    },
    updateTempMessageReplyTaskId: (state, action) => {
      const id = action.payload.messageId;
      const taskId = action.payload.taskId;
      messageRepliesAdapter.updateOne(state, {
        id,
        changes: {
          taskId: taskId,
        },
      });
    },
  },
});
export const {
  messageRepliesLoadingStarted,
  messageRepliesUpdated,
  messageRepliesAdded,
  messageRepliesReceived,
  replyMessage,
  replyTempMessage,
  updateTempMessageReplyTaskId,
  resetMessageReplies,
} = messageRepliesSlice.actions;
export const messageRepliesReducer = messageRepliesSlice.reducer;
export const messageRepliesSelectors =
  messageRepliesAdapter.getSelectors<RootState>(
    (state: RootState) => state.messageReplies,
  );
