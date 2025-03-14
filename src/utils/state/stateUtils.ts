import { PayloadAction } from '@reduxjs/toolkit';

/**
 * A type-safe way to update an object in state
 * @param state The current state object
 * @param payload The partial object to update
 */
export const updateObject = <T>(state: T, payload: Partial<T>): T => {
  return { ...state, ...payload };
};

/**
 * A type-safe way to handle loading states
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export const initialLoadingState: LoadingState = {
  isLoading: false,
  error: null,
};

/**
 * Helper functions for handling loading states in reducers
 */
export const loadingReducers = {
  startLoading: (state: LoadingState) => {
    state.isLoading = true;
    state.error = null;
  },
  loadingSuccess: (state: LoadingState) => {
    state.isLoading = false;
    state.error = null;
  },
  loadingFailed: (state: LoadingState, action: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = action.payload;
  },
};

/**
 * A type-safe way to handle pagination states
 */
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export const initialPaginationState: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
};

/**
 * Helper functions for handling pagination in reducers
 */
export const paginationReducers = {
  setPage: (state: PaginationState, action: PayloadAction<number>) => {
    state.page = action.payload;
  },
  setLimit: (state: PaginationState, action: PayloadAction<number>) => {
    state.limit = action.payload;
    // Reset to page 1 when changing limit
    state.page = 1;
  },
  setTotal: (state: PaginationState, action: PayloadAction<number>) => {
    state.total = action.payload;
  },
};

/**
 * A type-safe way to handle sorting states
 */
export interface SortingState<T extends string = string> {
  sortBy: T | null;
  sortDirection: 'asc' | 'desc';
}

export const initialSortingState = {
  sortBy: null,
  sortDirection: 'asc' as const,
};

/**
 * Helper functions for handling sorting in reducers
 */
export const sortingReducers = {
  setSorting: <T extends string>(
    state: SortingState<T>,
    action: PayloadAction<{ sortBy: T; sortDirection?: 'asc' | 'desc' }>
  ) => {
    const { sortBy, sortDirection = 'asc' } = action.payload;
    
    // If clicking the same column, toggle direction
    if (state.sortBy === sortBy) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, set to specified direction or default to asc
      state.sortBy = sortBy;
      state.sortDirection = sortDirection;
    }
  },
  resetSorting: <T extends string>(state: SortingState<T>) => {
    state.sortBy = null;
    state.sortDirection = 'asc';
  },
}; 