import Toast, {BaseToast} from 'react-native-toast-message';

interface ToastOptions extends BaseToast {
  message: string;
  desc?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  position?: 'top' | 'bottom';
}

export default function showToast({
  message,
  desc,
  type,
  duration = 2000,
  position = 'top',
}: ToastOptions) {
  Toast.show({
    type,
    visibilityTime: duration,
    position,
    text1: message,
    autoHide: true,
    text2: desc,
    swipeable: true,
    topOffset: 60,
  });
}

export function showErrorToast(
  message: string,
  desc?: string,
  position?: 'top',
) {
  showToast({message, desc, type: 'error', position});
}

export function showSuccessToast(
  message: string,
  desc?: string,
  position?: 'top',
) {
  showToast({message, desc, type: 'success', position});
}

export function showInfoToast(
  message: string,
  desc?: string,
  position?: 'top',
) {
  showToast({message, desc, type: 'info', position});
}
