import axios from 'axios';
import {MMKV} from 'react-native-mmkv';
import ApiConstants from '../ApiConstants';
import ApiUrls from '../ApiUrls';
import { showErrorToast } from '@src/utility/toast';

const mmkv = new MMKV();

export const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

const loginUser = async (userDetails: any) => {
  try {
    const {email, password} = userDetails;
    const response = await axios.post(
      ApiConstants.BASE_URL + ApiUrls.login,
      {email, password},
      config,
    );
    return {data: response.data};
  } catch (error: any) {
    showErrorToast(error?.response?.data?.message)
    console.error('Error calling login API:', error);
    return error;
  }
};

const signUpUser = async (userDetails: any) => {
  try {
    const {email, password, name} = userDetails;
    const response = await axios.post(
      ApiConstants.BASE_URL + ApiUrls.register,
      {email, password, name},
      config,
    );
    return {data: response.data};
  } catch (error: any) {
    showErrorToast(error?.response?.data?.message)
    console.error('Error calling login API:', error);
    return error;
  }
};

// const refreshUserToken = async (loginData: any) => {
//   try {
//     const {refreshToken} = loginData;
//     const response = await axios.post(
//       ApiConstants.API + ApiUrls.refreshToken,
//       {refreshToken},
//       config,
//     );
//     const {token} = response?.data?.data;
//     return {token, data: response.data.data};
//   } catch (error) {
//     console.error('Error refreshing token in hooks:', error);
//     return error;
//   }
// };

export {loginUser, signUpUser};
