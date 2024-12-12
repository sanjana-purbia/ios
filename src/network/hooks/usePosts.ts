import {MMKV} from 'react-native-mmkv';
import ApiConstants from '../ApiConstants';
import ApiUrls from '../ApiUrls';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import api from '../axiosInstance';
import {showSuccessToast} from '@src/utility/toast';
import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import {
  STORAGE_KEYS,
  clearDeletePostsFromStorage,
  clearEditPostsFromStorage,
  clearNewPostsFromStorage,
  getDeletePostsFromStorage,
  getEditPostsFromStorage,
  getNewPostsFromStorage,
  getPostsFromStorage,
  setDraftPostsInStorage,
  setPostsInStorage,
  setPublishedPostsInStorage,
} from '../storage/postsStorage';
import {processPosts} from '@src/utility';

const mmkv = new MMKV();

export const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// export const usePostsQuery = (postsPerPage: number) => {
//   return useInfiniteQuery({
//     queryKey: [STORAGE_KEYS.POSTS_CACHE_KEY],
//     queryFn: async ({pageParam = 1}) => {
//       const isConnected = await NetInfo.fetch().then(
//         state => state.isConnected,
//       );

//       if (!isConnected) {
//         // Offline mode: Retrieve posts from local storage
//         const storedPosts = getPostsFromStorage();
//         return {
//           posts: storedPosts,
//           nextPage: null,
//           totalPages: 1,
//         };
//       }

//       // Online mode: Fetch from API
//       const params = {page: pageParam, limit: postsPerPage};
//       try {
//         const res = await api.get(
//           `${ApiConstants.BASE_URL}${ApiUrls.getAllPosts}`,
//           {
//             ...config,
//             params,
//           },
//         );
//         const {rows, totalPages, page} = res.data?.data;

//         const sortedPosts = rows.sort((a: any, b: any) => {
//           const dateA = new Date(a.createdAt);
//           const dateB = new Date(b.createdAt);
//           return dateB.getTime() - dateA.getTime();
//         });

//         // Update local storage with fetched posts
//         setPostsInStorage(sortedPosts);

//         return {
//           posts: sortedPosts,
//           nextPage: page < totalPages ? page + 1 : null,
//           totalPages,
//         };
//       } catch (error) {
//         console.error('Error fetching posts:', error);

//         // Fallback to local storage if API fails
//         const storedPosts = getPostsFromStorage();
//         return {
//           posts: storedPosts,
//           nextPage: null,
//           totalPages: 1,
//         };
//       }
//     },
//     getNextPageParam: lastPage => lastPage.nextPage,
//     initialPageParam: 1,
//   });
// };

export const useGetAllPostsMutation = () => {
  return useMutation({
    mutationKey: [STORAGE_KEYS.POSTS_CACHE_KEY],
    mutationFn: async () => {
      console.log('hi')
      const isConnected = await NetInfo.fetch().then(
        state => state.isConnected,
      );

      if (!isConnected) {
        // Return stored posts if offline
        const storedPosts = getPostsFromStorage();
        return {
          data: {
            rows: storedPosts,
            totalPages: 1,
          },
        };
      }

      try {
        const result = await api.get(
          `${ApiConstants.BASE_URL}${ApiUrls.getAllPosts}`,
          {
            ...config,
            params: {page: 0}, // Fetch all posts
          },
        );
        
        // Process posts using centralized function
        const processedPosts = processPosts(result.data?.data?.rows || []);
        return {
          ...result.data,
          processedPosts,
        };
      } catch (error) {
        console.error('Error in fetching all posts:', error);

        // Fallback to stored posts
        const storedPosts = getPostsFromStorage();
        return {
          data: {
            rows: storedPosts,
            totalPages: 1,
          },
        };
      }
    },
  });
};

export const useCreatePostMutation = () => {
  const getAllPostsMutation = useGetAllPostsMutation();
  return useMutation({
    mutationFn: async (post: any) => {
      const isConnected = await NetInfo.fetch().then(
        state => state.isConnected,
      );

      if (!isConnected) {
        // Offline: Store new post in local storage with isSync = false
        const newPosts = getNewPostsFromStorage();
        const updatedNewPosts = [...newPosts, {...post, isSync: false}];
        mmkv.set(
          STORAGE_KEYS.NEW_POSTS_CACHE_KEY,
          JSON.stringify(updatedNewPosts),
        );

        return {...post, isSync: false};
      }

      try {
        const result = await api.post(
          ApiConstants.BASE_URL + ApiUrls.createPost,
          post,
          config,
        );
        showSuccessToast('Blog created successfully');
        return result.data;
      } catch (error) {
        console.error('Error creating post:', error);

        // Offline fallback: Store in local new posts with isSync = false
        const newPosts = getNewPostsFromStorage();
        const updatedNewPosts = [...newPosts, {...post, isSync: false}];
        mmkv.set(
          STORAGE_KEYS.NEW_POSTS_CACHE_KEY,
          JSON.stringify(updatedNewPosts),
        );
        throw error;
      }
    },
    onSuccess: async () => {
      // Invalidate the posts query to refresh the UI
      await getAllPostsMutation.mutateAsync();
    },
  });
};

export const useEditPostMutation = () => {
  const getAllPostsMutation = useGetAllPostsMutation();

  return useMutation({
    mutationFn: async (post: any) => {
      const isConnected = await NetInfo.fetch().then(
        state => state.isConnected,
      );

      if (!isConnected) {
        // Offline: Store edited post in local storage with isSync = false
        const editPosts = getEditPostsFromStorage();
        const updatedEditPosts = [...editPosts, {...post, isSync: false}];
        mmkv.set(
          STORAGE_KEYS.EDIT_POSTS_CACHE_KEY,
          JSON.stringify(updatedEditPosts),
        );

        return {...post, isSync: false};
      }

      try {
        const {id, ...params} = post;
        const result = await api.put(
          ApiConstants.BASE_URL + ApiUrls.updatePost(id),
          params,
          config,
        );
        return result.data;
      } catch (error) {
        console.error('Error editing post:', error);

        // Offline fallback: Store in local edit posts with isSync = false
        const editPosts = getEditPostsFromStorage();
        const updatedEditPosts = [...editPosts, {...post, isSync: false}];
        mmkv.set(
          STORAGE_KEYS.EDIT_POSTS_CACHE_KEY,
          JSON.stringify(updatedEditPosts),
        );

        throw error;
      }
    },
    onSuccess: async () => {
      // Invalidate the posts query to refresh the UI
      await getAllPostsMutation.mutateAsync();
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const isConnected = await NetInfo.fetch().then(
        state => state.isConnected,
      );

      if (!isConnected) {
        // Offline: Store deleted post ID in local storage with isSync = false
        const deletePosts = getDeletePostsFromStorage();
        const updatedDeletePosts = [
          ...deletePosts,
          {id: postId, isSync: false},
        ];
        mmkv.set(
          STORAGE_KEYS.DELETE_POSTS_CACHE_KEY,
          JSON.stringify(updatedDeletePosts),
        );

        return {id: postId, isSync: false};
      }

      try {
        const result = await api.delete(
          ApiConstants.BASE_URL + ApiUrls.deletePost(postId),
          config,
        );
        return result.data;
      } catch (error) {
        console.error('Error deleting post:', error);

        // Offline fallback: Store in local delete posts with isSync = false
        const deletePosts = getDeletePostsFromStorage();
        const updatedDeletePosts = [
          ...deletePosts,
          {id: postId, isSync: false},
        ];
        mmkv.set(
          STORAGE_KEYS.DELETE_POSTS_CACHE_KEY,
          JSON.stringify(updatedDeletePosts),
        );

        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the posts query to refresh the UI
      queryClient.invalidateQueries({queryKey: [STORAGE_KEYS.POSTS_CACHE_KEY]});
    },
  });
};

export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      try {
        const res = await api.get(
          ApiConstants.BASE_URL + ApiUrls.getPostById(postId),
          config,
        );
        return res.data?.data;
      } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
      }
    },
  });
};

// Background sync function to be called when internet is reconnected
export const syncOfflineData = async () => {
  const isConnected = await NetInfo.fetch().then(state => state.isConnected);

  if (!isConnected) return;

  // Sync new posts
  const newPosts = getNewPostsFromStorage();
  for (const post of newPosts) {
    try {
      await api.post(ApiConstants.BASE_URL + ApiUrls.createPost, post, config);
    } catch (error) {
      console.error('Error syncing new post:', error);
    }
  }
  clearNewPostsFromStorage();
  // Sync edited posts
  const editPosts = getEditPostsFromStorage();
  for (const post of editPosts) {
    try {
      const {id, ...params} = post;
      await api.put(
        ApiConstants.BASE_URL + ApiUrls.updatePost(id),
        params,
        config,
      );
    } catch (error) {
      console.error('Error syncing edited post:', error);
    }
  }
  clearEditPostsFromStorage()
  // Sync deleted posts
  const deletePosts = getDeletePostsFromStorage();
  for (const postId of deletePosts) {
    try {
      await api.delete(
        ApiConstants.BASE_URL + ApiUrls.deletePost(postId),
        config,
      );
    } catch (error) {
      console.error('Error syncing deleted post:', error);
    }
  }
clearDeletePostsFromStorage()};

// Hook to check and sync offline data when app comes online
export const useOfflineSync = () => {
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncOfflineData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
