import AppColors from '@src/utility/AppColors';
import AppConstants from '@src/utility/AppConstants';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    padding: AppConstants.MARGIN.MD_MARGIN,
    backgroundColor: AppColors.primary,
    borderRadius: AppConstants.MARGIN.MD_MARGIN,
    alignItems:'center',
    margin: AppConstants.MARGIN.MD_MARGIN,
  },
});
