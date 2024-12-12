import AppColors from "@src/utility/AppColors";
import AppConstants from "@src/utility/AppConstants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginBottom: AppConstants.MARGIN.MD_MARGIN,
      borderBottomWidth: 1,
      borderBottomColor: AppColors.border,
      padding: AppConstants.MARGIN.SM_MARGIN
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 50,
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      width: 300,
      marginLeft: 10,
    },
    header: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    category: {
      fontSize: 10,
      opacity: 0.8,
      padding: 2,
    },
  });