import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {loginUser, signUpUser} from '@src/network/hooks/useLogin';
import {viewStyles} from '@src/utility/ViewStyles';
import {InputBox} from '@src/components/Input';
import {AppButton} from '@src/components/appButton';
import styles from './styles';
import {UserContext} from '@config/userContext';
import {ROUTES_CONSTANTS} from '@src/config/RoutesConstants';

const AuthScreen = () => {
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, SetName] = useState<string>('');

  const navigation = useNavigation();
  const {setUser} = useContext(UserContext);

  const loginMutation = useMutation({
    mutationFn: () => loginUser({email, password}),
    onSuccess: (response: any) => {
      const {accessToken, refreshToken, email, id, role} = response.data?.data;
      setUser({id, email, accessToken, refreshToken, role});
      navigation.navigate(ROUTES_CONSTANTS.HOME_SCREEN);
    },
    onError: (error: any) => {
      console.log('Login error:', error);
    },
  });

  const signupMutation = useMutation({
    mutationFn: () => signUpUser({email, password, name}),
    onSuccess: (response: any) => {
      const {accessToken, refreshToken, email, id, role} = response.data?.data;
      setUser({id, email, accessToken, refreshToken, role});
      navigation.navigate(ROUTES_CONSTANTS.HOME_SCREEN);
    },
    onError: error => {
      console.log('Signup error:', error);
    },
  });

  const handleSubmit = () => {
    if (isSignup) {
      signupMutation.mutate();
    } else {
      loginMutation.mutate();
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
    SetName('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        style={viewStyles.containerWithBg}>
        <ScrollView keyboardShouldPersistTaps="always">
          <Image
            source={
              require('@assets/images/login_hero.png') as ImageSourcePropType
            }
            style={styles.imageBackground}
            resizeMode="contain"
          />
          <View style={viewStyles.paddedContainer}>
            <View style={styles.heading}>
              <Text style={viewStyles.titleText}>
                {isSignup ? 'Sign Up' : 'Login'}
              </Text>
            </View>
            {isSignup && (
              <InputBox
                placeholder={'Name'}
                onChangeText={(text: string) => SetName(text)}
                value={name.trimStart()}
              />
            )}
            <InputBox
              placeholder={'Email'}
              onChangeText={(text: string) => setEmail(text)}
              value={email.trimStart()}
            />
            <InputBox
              placeholder={'Password'}
              onChangeText={(text: string) => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <AppButton
              title={isSignup ? 'Sign Up' : 'Login'}
              onPress={handleSubmit}
            />
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isSignup
                  ? 'Already have an account?'
                  : "Don't have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.footerLink}>
                  {isSignup ? 'Login' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;
