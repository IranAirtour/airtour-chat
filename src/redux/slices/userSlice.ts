import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {REDUCER_NAMES} from '../contants';
import {selectById, sortComparerById} from 'airtour-components/src/utils/Other';
import {RootState} from '../store';
import {IUserModel} from '../../model/User';

export const userAdapter = createEntityAdapter<IUserModel>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: selectById,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: sortComparerById,
});

export const userSlice = createSlice({
  name: REDUCER_NAMES.user,
  initialState: userAdapter.getInitialState({
    loading: 'idle',
  }),
  reducers: {
    userLoadingStarted(state) {
      // Can update the additional state field
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
    userAdded: userAdapter.addOne,
    usersReceived(state, action) {
      userAdapter.upsertMany(state, action.payload.list);
      state.loading = 'idle';
    },
    userUpdated: userAdapter.updateOne,
  },
});
export const {userLoadingStarted, userAdded, usersReceived, userUpdated} =
  userSlice.actions;
export const userReducer = userSlice.reducer;
export const userSelectors = userAdapter.getSelectors<RootState>(
  (state: RootState) => state.user,
);
