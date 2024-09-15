import React, {memo, useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {viewStyles} from '@src/utility/ViewStyles';
import Ionicon from 'react-native-vector-icons/Ionicons'

interface ScreenHeaderProps {
  title?: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({title}) => {
  const navigation = useNavigation();

  const _onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerView}>
      <View style={viewStyles.row}>
        <TouchableOpacity onPress={_onBackPress}>
          <Ionicon name="chevron-back-outline" size={28} />
        </TouchableOpacity>
        {title ? <Text style={viewStyles.headerText}>{title}</Text> : null}
      </View>
    </View>
  );
};

export default memo(ScreenHeader);
