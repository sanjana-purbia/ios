import {useState, useEffect} from 'react';
import VersionCheck from 'react-native-version-check';

import {useAppState} from './useAppState';

/**
 * custom hook that checks whether the their is a new version of available to update to
 *
 * @returns `[needUpdate, setNeedUpdate]` - array representing the update state
 *
 * @example
 * const [needUpdate, setNeedUpdate] = useForceUpdate();
 *
 * if (needUpdate) {
 *  Alert.alert('A new version of the app is available')
 * }
 */
export const useForceUpdate = () => {
  const [needUpdate, setNeedUpdate] = useState(null);

  const appState = useAppState();

  useEffect(() => {
    if (appState.previous === 'background' && appState.current === 'active') {
      checkIfUpdateNeeded();
    }
  }, [appState]);

  useEffect(() => {
    checkIfUpdateNeeded();
  }, []);

  const checkIfUpdateNeeded = async () => {
    const result = await VersionCheck.needUpdate({
      depth: 1,
    });

    setNeedUpdate(result?.isNeeded || false);
  };

  return [needUpdate, setNeedUpdate];
};
