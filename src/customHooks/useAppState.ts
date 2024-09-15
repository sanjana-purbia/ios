import {useRef, useState, useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';

type AppStateObj = {
  current: AppStateStatus;
  previous: AppStateStatus | null;
};

/**
 * custom hook to get the current and
 * previous app's state (background, active, inactive, etc)
 */
export const useAppState: () => AppStateObj = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState<AppStateObj>({
    current: appState.current,
    previous: null,
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      const previousState = appState.current;
      appState.current = nextAppState;
      setAppStateVisible({
        current: appState.current,
        previous: previousState,
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};
