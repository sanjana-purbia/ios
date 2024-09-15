import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styles from './styles';
import { viewStyles } from '@src/utility/ViewStyles';

const AppButton = (props: any) => {
  const {title = '', onPress}: any = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={viewStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;
