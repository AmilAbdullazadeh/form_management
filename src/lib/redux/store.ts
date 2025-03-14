import { configureStore } from '@reduxjs/toolkit';

import fieldsReducer from './slices/fieldsSlice';
import formsReducer from './slices/formsSlice';

export const store = configureStore({
  reducer: {
    forms: formsReducer,
    fields: fieldsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/non-serializable/action'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 