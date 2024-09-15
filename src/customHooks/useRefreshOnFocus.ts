import {useCallback, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';

/**
 * custom hook that refreshes API data on screen focus
 *
 * @param refetch function that refetch API
 *
 * @example
 * useRefreshOnFocus(refetchUsers);
 */
export function useRefreshOnFocus(refetch: () => void) {
  const firstTimeRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch?.();
    }, [refetch]),
  );
}
