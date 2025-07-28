import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import themeReducer from './theme/themeSlice'


const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['currentUser'],
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
  blacklist: ['user', 'theme'], 
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
