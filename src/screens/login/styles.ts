import AppConstants from '@src/utility/AppConstants';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: AppConstants.SCREEN_HEIGHT / 2.5,
  },
  heading: {
    // ...viewStyles.center,
    marginBottom: 40,
  },
  loginButton: {
    // backgroundColor: PRIMARY_COLOR,
    borderRadius: AppConstants.MARGIN.LG_MARGIN,
    padding: AppConstants.SPACING.MD_SPACING,
    marginTop: 10,
    alignItems: 'center',
    margin: AppConstants.MARGIN.LG_MARGIN,
  },
  disabledLoginButton: {
    borderRadius: AppConstants.MARGIN.LG_MARGIN,
    padding: AppConstants.SPACING.MD_SPACING,
    marginTop: 10,
    alignItems: 'center',
    margin: AppConstants.MARGIN.LG_MARGIN,
  },
});
