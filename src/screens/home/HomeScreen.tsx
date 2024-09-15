import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {styles} from './styles';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useEditPostMutation,
  usePostsQuery,
} from '@src/network/hooks/usePosts';
import {
  clearDeletePostsFromStorage,
  clearEditPostsFromStorage,
  clearNewPostsFromStorage,
  getDeletePostsFromStorage,
  getEditPostsFromStorage,
  getNewPostsFromStorage,
} from '@src/network/storage/postsStorage';
import {Post} from '@src/components/post';
import {ROUTES_CONSTANTS} from '@src/config/RoutesConstants';
import {StackNavigationProp} from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'EDIT'>;

export default function HomeScreen({navigation}: {navigation: NavigationProp}) {
  const netInfo = useNetInfo();
  const {data: allPosts, isLoading, isError, refetch} = usePostsQuery();
  const createPostMutation = useCreatePostMutation();
  const editPostMutation = useEditPostMutation();
  const deletePostMutation = useDeletePostMutation();
  console.log('isError', isError);
  const updatePosts = async () => {
    const newPosts = getNewPostsFromStorage();
    const editPosts = getEditPostsFromStorage();
    const deletePosts = getDeletePostsFromStorage();

    for (const post of newPosts) {
      await createPostMutation.mutateAsync(JSON.parse(post));
    }
    clearNewPostsFromStorage();

    for (const post of editPosts) {
      await editPostMutation.mutateAsync(post);
    }
    clearEditPostsFromStorage();

    for (const postId of deletePosts) {
      await deletePostMutation.mutateAsync(postId);
    }
    clearDeletePostsFromStorage();

    refetch();
  };

  const onlineAction = async () => {
    console.log('You are Online');
    await updatePosts();
  };

  const offlineAction = () => {
    console.log('You are Offline');
    // No need to do anything here as we're already using cached data
  };

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = () => {
        if (netInfo.isConnected) {
          onlineAction();
        } else {
          offlineAction();
        }
      };

      return () => unsubscribe();
    }, []),
  );

  const Reload = async () => {
    console.log('refresh');
    await refetch();
  };

  const _onEditPost = (post: any) => {
    console.log('post', post)
    navigation.navigate(ROUTES_CONSTANTS.EDIT, {post});
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching posts</Text>;

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={{flex: 1, margin: 20, justifyContent: 'center'}}>
        <Text>All Posts</Text>
        {allPosts?.map((post: any, index: any) => (
          <Post post={post} key={index} onEdit={_onEditPost} />
        ))}
        <TouchableOpacity
          style={[styles.button, styles.newPostBtn]}
          onPress={() => navigation.navigate(ROUTES_CONSTANTS.WRITE)}>
          <Text style={[styles.buttonText, {color: '#fff'}]}>New Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.refreshBtn]}
          onPress={Reload}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
