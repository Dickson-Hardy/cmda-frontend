/**
 * Storage cleanup utilities for handling corrupted data
 */

export const StorageKeys = {
  PERSIST_ROOT: "persist:root",
  REDIRECT_URL: "redirectUrl",
  CONFERENCE_SLUG: "conferenceSlug",
  USER_PREFERENCES: "userPreferences",
};

/**
 * Clear all application storage
 */
export const clearAllStorage = () => {
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log("All storage cleared successfully");
    return true;
  } catch (error) {
    console.error("Error clearing storage:", error);
    return false;
  }
};

/**
 * Clear only Redux persist data
 */
export const clearPersistedData = () => {
  try {
    Object.values(StorageKeys).forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    console.log("Persisted data cleared successfully");
    return true;
  } catch (error) {
    console.error("Error clearing persisted data:", error);
    return false;
  }
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = (type = "localStorage") => {
  try {
    const storage = window[type];
    const test = "__storage_test__";
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (error) {
    console.warn(`${type} is not available:`, error);
    return false;
  }
};

/**
 * Safely get item from storage
 */
export const safeGetStorageItem = (key, defaultValue = null) => {
  try {
    if (!isStorageAvailable()) return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error getting storage item ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Safely set item to storage
 */
export const safeSetStorageItem = (key, value) => {
  try {
    if (!isStorageAvailable()) return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error setting storage item ${key}:`, error);
    return false;
  }
};

/**
 * Validate storage data integrity
 */
export const validateStorageData = () => {
  const issues = [];

  try {
    // Check if persist data exists and is valid
    const persistData = localStorage.getItem(StorageKeys.PERSIST_ROOT);
    if (persistData) {
      JSON.parse(persistData);
    }
  } catch (error) {
    issues.push("Corrupted persist data");
  }

  // Add more validation checks as needed

  return {
    isValid: issues.length === 0,
    issues,
  };
};

/**
 * Emergency cleanup for stuck loading states
 */
export const emergencyCleanup = () => {
  console.log("Performing emergency cleanup...");

  const validation = validateStorageData();
  if (!validation.isValid) {
    console.log("Found storage issues:", validation.issues);
    clearPersistedData();
  }

  // Clear any potentially problematic data
  const problematicKeys = ["redux-persist", "persist:root", "api-cache", "rtk-query-cache"];

  problematicKeys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  console.log("Emergency cleanup completed");

  // Optionally reload the page after cleanup
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};
