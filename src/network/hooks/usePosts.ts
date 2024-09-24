import { MMKV } from 'react-native-mmkv';
import ApiConstants from '../ApiConstants';
import ApiUrls from '../ApiUrls';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../axiosInstane';
import { showSuccessToast } from '@src/utility/toast';
import axios from 'axios';

const mmkv = new MMKV();

export const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const POSTS_CACHE_KEY = ['posts'];


export const usePostsQuery = (postsPerPage: number) => {
  return useInfiniteQuery<PostsResponse, Error>({
    queryKey: POSTS_CACHE_KEY,
    queryFn: async ({ pageParam = 1 }) => {
      const params = {page: pageParam, limit: postsPerPage }
      try {
        const res = await api.get(`${ApiConstants.BASE_URL}${ApiUrls.getAllPosts}`, {
          ...config,
         params,
        });
        const { rows, totalPages, page } = res.data?.data;

        const sortedPosts = rows.sort((a: Post, b: Post) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        return {
          posts: sortedPosts,
          nextPage: page < totalPages ? page + 1 : null,
          totalPages,
        };
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialData: () => {
      const storedPosts = mmkv.getString('posts');
      return storedPosts
        ? {
            pages: [{ posts: JSON.parse(storedPosts), nextPage: 2, totalPages: 1 }],
            pageParams: [1],
          }
        : undefined;
    },
    staleTime: 60000, // 1 minute
    gcTime: 3600000, // 1 hour
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: any) => {
      try {
        const result = await api.post(ApiConstants.BASE_URL + ApiUrls.createPost, post, config);
        showSuccessToast('Blog created successfully')
        return result.data;
      } catch (error) {
        console.error('Error creating post:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_CACHE_KEY });
    },
  });
};

export const useEditPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: any) => {
      try {
        const {id, ...params} = post
        const result = await api.put(ApiConstants.BASE_URL + ApiUrls.updatePost(id), params, config);
        return result.data;
      } catch (error) {
        console.error('Error editing post:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_CACHE_KEY });
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        const result = await api.delete(ApiConstants.BASE_URL + ApiUrls.deletePost(postId), config);
        return result.data;
      } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_CACHE_KEY });
    },
  });
};

// New query hook for fetching a single post
export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      try {
        const res = await api.get(ApiConstants.BASE_URL + ApiUrls.getPostById(postId), config);
        return res.data?.data;
      } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
      }
    },
  });
};
