import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {REDUCER_NAMES} from '../contants';
import {selectById, sortComparerById} from 'airtour-components/src/utils/Other';
import {RootState} from '../store';
import {IServerGroupMemberModel} from '../../model/ApiModels/GroupMember';

export const groupMembersAdapter = createEntityAdapter<IServerGroupMemberModel>(
  {
    // Assume IDs are stored in a field other than `book.id`
    selectId: selectById,
    // Keep the "all IDs" array sorted based on book titles
    sortComparer: sortComparerById,
  },
);

export const groupMembersSlice = createSlice({
  name: REDUCER_NAMES.groupMember,
  initialState: groupMembersAdapter.getInitialState({
    loading: 'idle',
  }),
  reducers: {
    resetGroupMember: state => {
      state.ids = [];
      state.entities = {};
    },
    groupMemberLoadingStarted(state) {
      // Can update the additional state field
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
    groupMemberAdded: groupMembersAdapter.addOne,
    groupMembersReceived(state, action) {
      groupMembersAdapter.addMany(state, action.payload.list);
      state.loading = 'idle';
    },
    groupMemberUpdated: groupMembersAdapter.updateOne,
  },
});
export const {
  groupMemberLoadingStarted,
  groupMemberAdded,
  groupMembersReceived,
  groupMemberUpdated,
  resetGroupMember,
} = groupMembersSlice.actions;
export const groupMemberReducer = groupMembersSlice.reducer;
export const groupMemberSelectors = groupMembersAdapter.getSelectors<RootState>(
  (state: RootState) => state.groupMember,
);
