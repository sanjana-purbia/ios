import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 10,
    },
    image: {
      width: 80,
      height: 80,
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
      fontSize: 20,
    },
    category: {
      fontSize: 10,
      opacity: 0.8,
      padding: 2,
    },
  });