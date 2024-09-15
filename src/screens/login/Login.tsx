import React, {useState} from 'react';
import styles from './styles';
import {View, Text, ScrollView, Image, ImageSourcePropType} from 'react-native';
import {viewStyles} from '@src/utility/ViewStyles';
import {InputBox} from '@src/components/Input';
import { AppButton } from '@src/components/appButton';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@src/network/hooks/useLogin';
import axios from 'axios';

const Login = (_props: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const mutation = useMutation({
    mutationFn: async () => {
      return await loginUser({email, password});
    },
    onSuccess: response => {
      if (axios.isAxiosError(response)) {
        // showErrorToast('Login failed');
        console.log('error >>> ', response);
      } else {
        const {data, token} = response;
        // showSuccessToast(LOGIN_SUCCESSFUL);
      }
    },
  });

  const _onLogin = () => {
    mutation.mutate()
  }
  return (
    <View style={viewStyles.containerWithBg}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Image
          source={
            require('@assets/images/login_hero.png') as ImageSourcePropType
          }
          style={styles.imageBackground}
          resizeMode="contain"
        />
        <View style={viewStyles.paddedContainer}>
          <View style={styles.heading}>
            {/* <Text style={viewStyles.titleText}>{PARKOYE}</Text>
            <Text style={viewStyles.boldText}>{WELCOME_MESSAGE}</Text> */}
          </View>
          <InputBox
            placeholder={'Username'}
            onChangeText={(text: React.SetStateAction<string>) =>
              setEmail(text)
            }
            value={email.trimStart()}
          />
          <InputBox
            placeholder={'Password'}
            onChangeText={(text: React.SetStateAction<string>) =>
              setPassword(text)
            }
            value={password}
            secureTextEntry
          />
           <AppButton title='Login' onPress={_onLogin}/>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;
