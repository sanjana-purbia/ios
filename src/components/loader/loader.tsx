import React from 'react';
import styles from './styles';
import {Modal, View, ActivityIndicator, Text} from 'react-native';
import AppColors from '@src/utility/AppColors';

const Loader = (props: { loading: boolean; loadingText: string; }) => {
  const {loading, loadingText} = props;
  return (
    <Modal
      visible={loading}
      animationType="none"
      onRequestClose={() => {}}
      useNativeDriver={true}
      transparent={true}>
      <View style={styles.loaderHolder}>
        <View style={styles.activityIndicator}>
          <ActivityIndicator color={AppColors.primary} />
          {loadingText ? (
            <Text style={styles.text}>{loadingText}...</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
export default Loader;
