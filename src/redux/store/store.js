import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers/rootReducer";
import combinedMiddlewares from "../middlewares";

const persistConfig = {
  key: "root",
  storage,
  timeout: 10000, // 10 second timeout
  throttle: 100, // Throttle writes to storage
  debug: false, // Set to true only for debugging
  whitelist: ["auth", "token"], // Only persist auth and token
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore certain paths that might contain non-serializable data
        ignoredPaths: ["register"],
      },
      immutableCheck: { warnAfter: 128 },
    }).concat(combinedMiddlewares),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store, null, () => {
  console.log("Persistor rehydration complete");
});

// Handle persistor errors
persistor.subscribe(() => {
  const state = persistor.getState();
  if (state.error) {
    console.error("Persistor error:", state.error);
    // Clear storage and reload on critical errors
    storage.removeItem("persist:root").then(() => {
      console.log("Cleared corrupted persistence data");
    });
  }
});

export default store;
