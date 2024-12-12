import React, {useContext, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';

import {
  getDraftPostsFromStorage,
  getPublishedPostsFromStorage,
} from '@network/storage/postsStorage';

import {Post} from '@components/post';
import {ScreenHeader} from '@components/absoluteBackHeader';

import {ROUTES_CONSTANTS} from '@config/RoutesConstants';
import {UserContext} from '@config/userContext';

import {viewStyles} from '@utility/ViewStyles';
import AppConstants from '@utility/AppConstants';

import {EditProps} from '@src/types/rootStackParamList';

import {styles} from './styles';

export default function Posts() {
  const navigation = useNavigation<EditProps>();
  const route = useRoute<EditProps>();

  const {user, userRole} = useContext(UserContext);
  const {from} = route?.params;

  const isEditDisabled = AppConstants.ROLE.VIEWER === userRole;

  const storedPublishedPosts = getPublishedPostsFromStorage();
  const storedDraftPosts = getDraftPostsFromStorage();

  const allPosts = useMemo(() => {
    const posts =
      from === 'Published' ? storedPublishedPosts : storedDraftPosts;
    return posts;
  }, [storedDraftPosts, storedPublishedPosts, from]);

  const _onEditPost = (post: any) => {
    navigation.navigate(ROUTES_CONSTANTS.EDIT, {post, isEditDisabled});
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <Post post={item} onEdit={_onEditPost} isEditDisabled={isEditDisabled} />
    );
  };

  return (
    <View style={viewStyles.container}>
      <ScreenHeader title="Blogs" />
      <View style={viewStyles.paddedContainer}>
        <FlatList
          data={allPosts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
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
    </View>
  );
}
