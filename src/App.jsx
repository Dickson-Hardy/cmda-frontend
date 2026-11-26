import AppRouter from "./routes/AppRouter";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTokens } from "./redux/features/auth/tokenSlice";
import { refreshSession } from "./utilities/refreshSession";
import { API_BASE_URL } from "./utilities/apiBaseUrl";
import ErrorBoundary from "./components/Global/ErrorBoundary/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import SupportLauncher from "./components/Support/SupportLauncher";
import InstallGuide from "./components/Global/InstallGuide/InstallGuide";

const PublicSupport = lazy(() => import("./components/Support/SupportPortal"));

export default function App() {
  // The cross-site widget must not depend on a member session or persisted storage.
  if (["/support", "/support/embed"].includes(window.location.pathname)) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<p role="status">Loading support…</p>}>
          <PublicSupport embedded={window.location.pathname.endsWith("/embed")} />
        </Suspense>
      </ErrorBoundary>
    );
  }
  return <MemberApp />;
}

// Access tokens are intentionally memory-only, so after a reload the socket
// and API need a fresh token from the HttpOnly refresh cookie.
function RestoreSession() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const hasToken = useSelector((state) => Boolean(state.token?.accessToken));

  useEffect(() => {
    if (!isAuthenticated || hasToken) return;
    refreshSession(API_BASE_URL).then((tokens) => {
      if (tokens) dispatch(setTokens(tokens));
    });
  }, [dispatch, isAuthenticated, hasToken]);

  return null;
}

function MemberApp() {
  const [persistorReady, setPersistorReady] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // Set a timeout to handle cases where persistor gets stuck
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
      console.warn("PersistGate loading timeout - forcing app to load");
    }, 10000); // 10 seconds timeout

    // Check if persistor is ready
    const checkPersistor = () => {
      if (persistor.getState().bootstrapped) {
        setPersistorReady(true);
        clearTimeout(timeout);
      }
    };

    checkPersistor();

    // Listen for persistor state changes
    const unsubscribe = persistor.subscribe(() => {
      checkPersistor();
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const LoadingComponent = () => (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
      <h2 className="font-bold text-xl mb-2">Loading...</h2>
      {loadingTimeout && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Taking longer than usual?</p>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primaryDark text-sm"
          >
            Clear Cache & Reload
          </button>
        </div>
      )}
    </div>
  );
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingComponent />} persistor={persistor}>
            <RestoreSession />
            {(persistorReady || loadingTimeout) && <AppRouter />}
            {(persistorReady || loadingTimeout) && <SupportLauncher />}
            {(persistorReady || loadingTimeout) && <InstallGuide />}

            <ToastContainer
              position="top-right"
              autoClose={6000}
              hideProgressBar
              limit={2}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
