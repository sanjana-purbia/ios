import React, {useEffect, useRef, useState} from 'react';
import {EmitterSubscription, Keyboard} from 'react-native';

type KeyboardState = {
  isOpen: boolean;
  keyboardHeight: number;
};

/**
 * @typedef {Object} KeyboardState
 * @property {boolean} isOpen - if the keyboard is visible.
 * @property {number} keyboardHeight - the height of the keyboard.
 */

/**
 * custom hook that listens to the keyboard state
 *
 * @returns {KeyboardState} `KeyboardState` object representing keyboard state summary
 */
export const useKeyboardStatus: () => KeyboardState = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const keyboardHideListener = useRef<null | EmitterSubscription>(null);
  const keyboardShowListener = useRef<null | EmitterSubscription>(null);

  const onKeyboardShow = (e: {
    endCoordinates: {height: React.SetStateAction<number>};
  }) => {
    setKeyboardHeight(e.endCoordinates.height);
    setIsOpen(true);
  };

  const onKeyboardHide = () => {
    setKeyboardHeight(0);
    setIsOpen(false);
  };

  useEffect(() => {
    keyboardShowListener.current = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardShow,
    );
    keyboardHideListener.current = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardHide,
    );

    return () => {
      keyboardShowListener.current?.remove();
      keyboardHideListener.current?.remove();
    };
  }, []);

  return {
    isOpen: isOpen,
    keyboardHeight: keyboardHeight,
  };
};
