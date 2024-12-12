import {StyleSheet} from 'react-native';

import AppConstants from '@utility/AppConstants';
import { viewStyles } from '@utility/ViewStyles';
import AppColors from '@utility/AppColors';

export default StyleSheet.create({
  loaderHolder: {
    ...viewStyles.centered,
    ...viewStyles.container,
    backgroundColor: AppColors.modal_background,
  },

  activityIndicator: {
    backgroundColor: AppColors.white,
    width: 100,
    height: 100,
    ...viewStyles.centered,
  },
  text: {
    fontSize: AppConstants.FONT_SIZE.f10,
    color: AppColors.gray_text,
    marginTop: AppConstants.MARGIN.SM_MARGIN,
  },
});
