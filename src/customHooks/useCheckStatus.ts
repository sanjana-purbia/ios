import {useRef, useEffect} from 'react';
import {API_STATUS} from '@utility';

type Params = {
  status: string;
  onError: () => void;
  onSuccess: () => void;
};

/**
 * custom hook that that runs success and error handler based on API response
 *
 * @param status API call status
 * @param onSuccess callback to run on success
 * @param onError callback to run on error
 *
 */
const useCheckStatus = ({status, onSuccess, onError}: Params) => {
  const checkRef = useRef<boolean>();

  useEffect(() => {
    if (status === API_STATUS.SUCCESS) {
      if (checkRef.current) {
        onSuccess?.();
        checkRef.current = false;
      }
    } else if (status === API_STATUS.ERROR) {
      if (checkRef.current) {
        onError?.();
        checkRef.current = false;
      }
    } else if (status === API_STATUS.FETCHING) {
      checkRef.current = true;
    }
  }, [onError, onSuccess, status]);
  return status;
};

export default useCheckStatus;
