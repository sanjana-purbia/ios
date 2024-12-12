import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  LOGIN: undefined;
  HOME_SCREEN: undefined;
  EDIT: { post: BlogPost, isEditDisabled: boolean };
  POSTS: {from: string};
  WRITE: {postId?: string} | undefined;
};

type EditProps = NativeStackScreenProps<RootStackParamList, 'EDIT'>;

type WriteScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'WRITE'
>;