import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccaf9b',
  },
  paddedContainer: {
    padding: 20,
  },
  headerStyle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#312921',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  richTextContainer: {
    width: '100%',
    marginBottom: 20,
  },
  richTextEditorStyle: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccaf9b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },
  richTextToolbarStyle: {
    backgroundColor: '#c6c3b3',
    borderColor: '#c6c3b3',
    borderRadius: 10,
    borderWidth: 1,
  },
  errorTextStyle: {
    color: '#FF0000',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#c6c3b3',
    borderWidth: 1,
    borderColor: '#c6c3b3',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#312921',
  },
});
