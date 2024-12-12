import AppColors from '@src/utility/AppColors';
import AppConstants from '@src/utility/AppConstants';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuredView: {
    elevation: 3,
    borderRadius: AppConstants.MARGIN.SM_MARGIN,
    borderWidth: 0.5,
    borderColor: AppColors.border,
    shadowOpacity: 0.1,
  },
  featuredImage: {
    height: 200,
    width: AppConstants.SCREEN_WIDTH - 32,
    borderTopLeftRadius: AppConstants.MARGIN.SM_MARGIN,
    borderTopRightRadius: AppConstants.MARGIN.SM_MARGIN,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: AppConstants.MARGIN.MD_MARGIN,
  },
  tabButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    flex: 1,
    alignItems:'center',
    marginHorizontal: AppConstants.MARGIN.XS_MARGIN
  },
  activeTabButton: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  tabText: {
    color: AppColors.black,
    fontSize: 16,
  },
  activeTabText: {
    color: AppColors.white,
  },
  seeMore: {
    alignSelf: 'flex-end',
    textDecorationLine:'underline',
    color: AppColors.primary
  }
});
