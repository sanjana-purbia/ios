import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ImageProps,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import {Post} from '@components/post';
import {Loader} from '@src/components/loader';

import {ROUTES_CONSTANTS} from '@config/RoutesConstants';
import {UserContext} from '@config/userContext';

import AppConstants from '@utility/AppConstants';
import {dispalyDateFormat, processPosts} from '@src/utility';
import {viewStyles} from '@utility/ViewStyles';

import {EditProps} from '@src/types/rootStackParamList';

import {
  getPostsFromStorage,
  getPublishedPostsFromStorage,
  getDraftPostsFromStorage,
} from '@network/storage/postsStorage';
import {useGetAllPostsMutation} from '@network/hooks/usePosts';
import {useOfflineSync} from '@network/hooks/usePosts'; // Import the useOfflineSync hook

import {styles} from './styles';

type BlogStatus = keyof typeof AppConstants.BLOG_STATUS;

const blog_image = require('@assets/images/blog_placeholder.png');

export default function HomeScreen() {
  const navigation = useNavigation<EditProps>();
  const isFocused = useIsFocused();
  const {user, userRole} = useContext(UserContext);

  const [activeTab, setActiveTab] = useState<string>(
    AppConstants.BLOG_STATUS.Published,
  );
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);
  const [draftPosts, setDraftPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(true);

  const getAllPostsMutation = useGetAllPostsMutation();
  const isEditDisabled = AppConstants.ROLE.VIEWER === userRole;

  useOfflineSync(); // Call useOfflineSync to handle offline data synchronization

  const fetchAllPosts = async () => {
    try {
      setIsSyncing(true);
      // get posts from storage
      const storedPosts = getPostsFromStorage();
      const storedPublishedPosts = getPublishedPostsFromStorage();
      const storedDraftPosts = getDraftPostsFromStorage();

      if (storedPosts.length > 0) {
        setAllPosts(storedPosts);
        setPublishedPosts(storedPublishedPosts);
        setDraftPosts(storedDraftPosts);
      }

      const result = await getAllPostsMutation.mutateAsync(); //fetching from api
      if (result.data?.rows) {
        const {allPosts, publishedPosts, draftPosts} = processPosts(
          result.data.rows,
        );

        setAllPosts(allPosts);
        setPublishedPosts(publishedPosts);
        setDraftPosts(draftPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, [isFocused]);

  const _onEditPost = (post: BlogPost) => {
    navigation.navigate(ROUTES_CONSTANTS.EDIT, {
      post,
      isEditDisabled,
    });
  };

  const _onSeeMore = () => {
    navigation.navigate(ROUTES_CONSTANTS.POSTS, {from: activeTab});
  };

  const renderItem = React.useCallback(
    ({item}: {item: BlogPost}) => (
      <Post post={item} onEdit={_onEditPost} isEditDisabled={isEditDisabled} />
    ),
    [isEditDisabled, _onEditPost],
  );

  const renderFooter = React.useCallback(
    () => (
      <TouchableOpacity onPress={_onSeeMore} style={viewStyles.container}>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>
    ),
    [_onSeeMore],
  );

  // Show loader while syncing or loading
  if (isLoading || isSyncing) {
    return (
      <Loader
        loading={isLoading || isSyncing}
        loadingText={isSyncing ? 'Syncing...' : 'Loading...'}
      />
    );
  }

  const featuredPost = allPosts?.[0];
  const blogImage = featuredPost?.imageUrl
    ? {uri: featuredPost?.imageUrl}
    : blog_image;

  return (
    <ScrollView stickyHeaderIndices={[1]} style={{backgroundColor: 'white'}}>
      <View style={viewStyles.paddedContainer}>
        {featuredPost && (
          <View style={styles.featuredView}>
            <Image
              source={blogImage as ImageProps}
              style={styles.featuredImage}
              resizeMode="stretch"
            />
            <View style={{padding: AppConstants.MARGIN.SM_MARGIN}}>
              <Text style={viewStyles.headerText}>{featuredPost.title}</Text>
              <Text style={viewStyles.regularText}>{featuredPost.summary}</Text>
              <Text style={[viewStyles.smallGrayText, {alignSelf: 'flex-end'}]}>
                {dispalyDateFormat(featuredPost?.date)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.tabContainer}>
          {Object.values(AppConstants.BLOG_STATUS).map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.tabButton,
                activeTab === status && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(status as BlogStatus)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === status && styles.activeTabText,
                ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          scrollEnabled={false}
          data={
            activeTab === AppConstants.BLOG_STATUS.Published
              ? publishedPosts
              : draftPosts
          }
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={renderFooter}
        />
      </View>
    </ScrollView>
  );
}
