import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {REDUCER_NAMES} from '../contants';
import {RootState} from '../store';
import {selectById, sortComparerById} from 'airtour-components/src/utils/Other';
import moment from 'moment';
import {IMessageModel} from '../../model/Chat/Message';
import {IFileModel, IImageAssetModel} from '../../model/Chat/File';

export const messagesAdapter = createEntityAdapter<IMessageModel>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: selectById,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: sortComparerById,
});
interface IChatInitial {
  loading: string;
  reply: IMessageModel | null;
  replyImage: IImageAssetModel | null;
  replyFile: IFileModel | null;
}
const InitialState: IChatInitial = {
  loading: 'idle',
  reply: null,
  replyImage: null,
  replyFile: null,
};
export const chatSlice = createSlice({
  name: REDUCER_NAMES.chat,
  initialState: messagesAdapter.getInitialState(InitialState),
  reducers: {
    resetChatMessages: state => {
      state.ids = [];
      state.entities = {};
    },
    messagesLoadingStarted(state) {
      // Can update the additional state field
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
    messagesAdded: messagesAdapter.addOne,
    messagesReceived(state, action) {
      messagesAdapter.addMany(state, action.payload.list);
      state.loading = 'idle';
    },
    messagesUpdated: messagesAdapter.updateOne,
    clearReplyAndAttachment: state => {
      state.reply = null;
      state.replyImage = null;
      state.replyFile = null;
    },
    clearReplyAttachment: state => {
      state.replyImage = null;
      state.replyFile = null;
    },
    setReplyContent: (state, action) => {
      const {key, value} = action.payload;
      // @ts-ignore
      state[key] = value;
    },
    setReplyTo: (state, action) => {
      state.reply = action.payload.reply;
    },
    deleteMessage: (state, action) => {
      messagesAdapter.removeOne(state, action.payload.id);
    },
    addTempMessage: (state, action) => {
      const message = {
        ...action.payload.message,
        createdAt: moment().unix(),
        sent: false,
      };
      messagesAdapter.addOne(state, message);
      state.replyImage = null;
      state.replyFile = null;
    },
    addMessage: (state, action) => {
      // update temp message id with server id
      const id = action.payload.message?.tempId;
      const tempMessageExist: boolean = state.ids.includes(id);
      const message = {
        ...action.payload.message,
        taskId: null,
        createdAt: moment().unix(),
        sent: true,
      };
      if (tempMessageExist) {
        messagesAdapter.updateOne(state, {
          id,
          changes: {
            ...message,
            tempId: null,
            _id: action.payload.message._id,
            taskId: null,
            sent: true,
          },
        });
      } else {
        messagesAdapter.addOne(state, message);
      }
    },
    increaseMessageReplyCount: (state, action) => {
      const {id} = action.payload;
      messagesAdapter.updateOne(state, {
        id,
        changes: {
          replyCount:
            (messagesAdapter?.getSelectors()?.selectById(state, id)
              ?.replyCount || 0) + 1,
        },
      });
    },
    updateTempMessageTaskId: (state, action) => {
      const id = action.payload.messageId;
      const taskId = action.payload.taskId;
      messagesAdapter.updateOne(state, {
        id,
        changes: {
          taskId: taskId,
        },
      });
    },
  },
});
export const {
  messagesLoadingStarted,
  messagesUpdated,
  messagesAdded,
  messagesReceived,
  addMessage,
  deleteMessage,
  setReplyTo,
  setReplyContent,
  clearReplyAndAttachment,
  increaseMessageReplyCount,
  clearReplyAttachment,
  addTempMessage,
  updateTempMessageTaskId,
  resetChatMessages,
} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
export const chatSelectors = messagesAdapter.getSelectors<RootState>(
  (state: RootState) => state.chat,
);
