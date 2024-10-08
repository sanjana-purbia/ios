import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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
import {viewStyles} from '@src/utility/ViewStyles';
import AppColors from '@src/utility/AppColors';
import {UserContext} from '@src/config/userContext';
import AppConstants from '@src/utility/AppConstants';

type NavigationProp = StackNavigationProp<RootStackParamList, 'EDIT'>;

const POSTS_PER_PAGE = 10;

export default function HomeScreen({navigation}: {navigation: NavigationProp}) {
  const {user, userRole} = useContext(UserContext);
  const isEditDisabled = AppConstants.ROLE.VIEWER === userRole;
  const netInfo = useNetInfo();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    refetch,
    isFetchingNextPage,
  } = usePostsQuery(POSTS_PER_PAGE);
  const createPostMutation = useCreatePostMutation();
  const editPostMutation = useEditPostMutation();
  const deletePostMutation = useDeletePostMutation();
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
    await updatePosts();
  };

  const offlineAction = () => {
    // No need to do anything here as we're already using cached data
  };

  useEffect(() => {
    if (netInfo.isConnected) {
      onlineAction();
    } else {
      offlineAction();
    }
  }, [netInfo.isConnected]);

  const _onEditPost = (post: any) => {
    navigation.navigate(ROUTES_CONSTANTS.EDIT, {post, isEditDisabled});
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <Post post={item} onEdit={_onEditPost} isEditDisabled={isEditDisabled} />
    );
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={viewStyles.container}>
        <ActivityIndicator size="small" color={AppColors.primary} />
      </View>
    );
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error fetching posts</Text>;

  const allPosts = data?.pages.flatMap(page => page.posts) || [];

  return (
    <View style={viewStyles.paddedContainer}>
      <Text style={[viewStyles.titleText, {marginBottom: 5}]}>Blogs</Text>
      <FlatList
        data={allPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
      {!isEditDisabled && (
        <TouchableOpacity
          style={[styles.button, styles.newPostBtn]}
          onPress={() => navigation.navigate(ROUTES_CONSTANTS.WRITE)}>
          <Text style={[styles.buttonText, {color: '#fff'}]}>New Blog</Text>
        </TouchableOpacity>
      )}
      {/* <TouchableOpacity
        style={[styles.button, styles.refreshBtn]}
        onPress={() => refetch()}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity> */}
    </View>
  );
}
