import {Dimensions} from 'react-native';

const AppConstants = {
  SCREEN_WIDTH: Dimensions.get('screen').width,
  SCREEN_HEIGHT: Dimensions.get('screen').height,
  FONT_SIZE: {
    f10: 10,
    f12: 12,
    f13: 13,
    f14: 14,
    f15: 15,
    f16: 16,
    f18: 18,
    f20: 20,
    f22: 22,
    f26: 26,
    f30: 30,
  },
  SPACING: {
    XS_SPACING: 2,
    SM_SPACING: 4,
    MD_SPACING: 8,
    LG_SPACING: 12,
    XL_SPACING: 24,
  },
  MARGIN: {
    XS_MARGIN: 5,
    SM_MARGIN: 10,
    MD_MARGIN: 15,
    LG_MARGIN: 20,
  },
};

export default AppConstants;
