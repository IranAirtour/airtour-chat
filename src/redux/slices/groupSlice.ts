import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {REDUCER_NAMES} from '../contants';
import {selectById, sortComparerById} from 'airtour-components/src/utils/Other';
import {RootState} from '../store';
import {IGroupItem} from '../../model/Chat/Group';

export const groupAdapter = createEntityAdapter<IGroupItem>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: selectById,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: sortComparerById,
});

export const groupSlice = createSlice({
  name: REDUCER_NAMES.group,
  initialState: groupAdapter.getInitialState({
    loading: 'idle',
    downloadedFileIds: {},
  }),
  reducers: {
    resetGroup: state => {
      state.ids = [];
      state.entities = {};
    },
    groupLoadingStarted(state) {
      // Can update the additional state field
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
    groupAdded: groupAdapter.addOne,
    groupsReceived(state, action) {
      groupAdapter.upsertMany(state, action.payload.list);
      state.loading = 'idle';
    },
    groupUpdated: groupAdapter.updateOne,
    updateGroupLastMessage: (state, action) => {
      const {
        lastMessage,
        group: {_id},
      } = action.payload;
      if (lastMessage?.file?.path) {
        lastMessage.type = 2;
      } else {
        lastMessage.type = 1;
      }
      const id = Number(_id);
      groupAdapter.updateOne(state, {
        id,
        changes: {
          lastMessage,
        },
      });
    },
    updateGroupLastSeenMessageId: (state, action) => {
      const {
        group: {_id, lastSeenMessageId = null, unSeenMessagesCount = 0},
      } = action.payload;
      const id = Number(_id);
      groupAdapter.updateOne(state, {
        id,
        changes: {unSeenMessagesCount, lastSeenMessageId},
      });
    },
    addDownloadedAttachment: (state, action) => {
      const attachmentId = action.payload;
      state.downloadedFileIds[attachmentId] = true;
    },
  },
});
export const {
  groupLoadingStarted,
  groupAdded,
  groupsReceived,
  groupUpdated,
  updateGroupLastMessage,
  updateGroupLastSeenMessageId,
  addDownloadedAttachment,
  resetGroup,
} = groupSlice.actions;
export const groupReducer = groupSlice.reducer;
export const groupSelectors = groupAdapter.getSelectors<RootState>(
  (state: RootState) => state.group,
);
