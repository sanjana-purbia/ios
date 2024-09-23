import AppConstants from '@src/utility/AppConstants';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: AppConstants.SCREEN_HEIGHT / 2.5,
  },
  heading: {
    marginBottom: AppConstants.MARGIN.MD_MARGIN,
  },
  loginButton: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#333',
    fontSize: 14,
  },
  footerLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
