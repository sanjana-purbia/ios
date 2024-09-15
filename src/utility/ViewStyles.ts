import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import AppColors from './AppColors';
import AppConstants from './AppConstants';

// Styles
interface Styles {
  shadowStyle: ViewStyle;
  regularText: TextStyle;
  text: TextStyle;
  boldText: TextStyle;
  smallBoldText: TextStyle;
  titleText: TextStyle;
  headerText: TextStyle;
  buttonText: TextStyle;
  container: ViewStyle;
  containerWithBg: ViewStyle;
  paddedContainer: ViewStyle;
  row: ViewStyle;
  rowSpread: ViewStyle;
  rowCentered: ViewStyle;
  centered: ViewStyle;
}

export const viewStyles = StyleSheet.create<Styles>({
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  regularText: {
    fontSize: AppConstants.FONT_SIZE.f14,
    color: AppColors.black,
  },
  text: {
    fontSize: AppConstants.FONT_SIZE.f16,
    fontWeight: '500',
    color: AppColors.gray_text
  },
  boldText: {
    fontSize: AppConstants.FONT_SIZE.f20,
    fontWeight: 'bold',
  },
  smallBoldText: {
    fontSize: AppConstants.FONT_SIZE.f12,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: AppConstants.FONT_SIZE.f22,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: AppConstants.FONT_SIZE.f20,
    fontWeight: 'bold',
    color: AppColors.black,
  },
  buttonText: {
    fontSize: AppConstants.FONT_SIZE.f18,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  container: {flex: 1},
  containerWithBg: {flex: 1, backgroundColor: AppColors.white},
  paddedContainer: {flex: 1, backgroundColor: AppColors.white, padding: 15},
  row: {flexDirection: 'row', alignItems: 'center'},
  rowSpread: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {alignItems: 'center', justifyContent: 'center'},
});
