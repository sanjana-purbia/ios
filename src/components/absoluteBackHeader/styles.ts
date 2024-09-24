import AppColors from '@src/utility/AppColors';
import AppConstants from '@src/utility/AppConstants';
import {StyleSheet} from 'react-native';
import { viewStyles } from '@src/utility/ViewStyles';

export const styles = StyleSheet.create({
  headerView: {
    backgroundColor: AppColors.white,
    padding: AppConstants.MARGIN.SM_MARGIN,
    ...viewStyles.rowSpread,
  },
  logout: {
    marginRight: AppConstants.MARGIN.SM_MARGIN
  },
  disabled: {
    opacity: 0.5
  }
});
