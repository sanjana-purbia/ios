import {StyleSheet} from 'react-native';
import AppColors from '@src/utility/AppColors';
import {viewStyles} from '@src/utility/ViewStyles';
import AppConstants from '@src/utility/AppConstants';

export const styles = StyleSheet.create({
  container: {
    marginTop: AppConstants.MARGIN.XS_MARGIN,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: AppConstants.MARGIN.SM_MARGIN,
    borderColor:AppColors.border,
    margin: AppConstants.MARGIN.SM_MARGIN,
    padding: AppConstants.MARGIN.MD_MARGIN,
  },
  focusedInput: {
    borderColor: AppColors.primary 
  },
});
