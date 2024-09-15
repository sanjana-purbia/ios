import React, {forwardRef, memo, useState} from 'react';
import {Text, TextInput, TextInputProps, View} from 'react-native';
import {styles} from './styles';
import AppColors from '@src/utility/AppColors';

interface InputBoxProps extends TextInputProps {
  onSubmit?: () => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const InputBox = forwardRef<TextInput, InputBoxProps>(
  ({onSubmit, placeholder, value, onChangeText, label, ...other}, ref) => {
    const [focusedInput, setFocusedInput] = useState(false);

    return (
      <View style={styles.container}>
        <TextInput
          onFocus={() => setFocusedInput(true)}
          onBlur={() => setFocusedInput(false)}
          ref={ref}
          style={[styles.input, focusedInput? styles.focusedInput: {}]}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={AppColors.gray_text}
          {...other}
        />
      </View>
    );
  },
);


export default memo(InputBox);
