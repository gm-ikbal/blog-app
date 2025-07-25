import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import themeReducer from './theme/themeSlice'

// Create separate persist configs for each reducer
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['currentUser'], // Only persist currentUser, not error or loading states
};

const themePersistConfig = {
  key: 'theme',
  storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  theme: persistReducer(themePersistConfig, themeReducer)
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  blacklist: ['user', 'theme'], // Don't persist the root level since we're persisting individual reducers
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
