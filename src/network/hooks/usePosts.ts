import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
import ApiConstants from '../ApiConstants';
import ApiUrls from '../ApiUrls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const mmkv = new MMKV();

export const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const POSTS_CACHE_KEY = ['posts'];

export const usePostsQuery = () => {
  return useQuery({
    queryKey: POSTS_CACHE_KEY,
    queryFn: async () => {
      try {
        const res = await axios.get(ApiConstants.BASE_URL + ApiUrls.getAllPosts, config);
        const sortedPosts = res.data.slice().sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        mmkv.set('posts', JSON.stringify(sortedPosts));
        return sortedPosts;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    },
    initialData: () => {
      const storedPosts = mmkv.getString('posts');
      return storedPosts ? JSON.parse(storedPosts) : [];
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
        const result = await axios.post(ApiConstants.BASE_URL + ApiUrls.createPost, post, config);
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
        const result = await axios.post(ApiConstants.BASE_URL + ApiUrls.updatePost(post.postid), post, config);
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
        const result = await axios.post(ApiConstants.BASE_URL + ApiUrls.deletePost(postId), {}, config);
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
        const res = await axios.get(ApiConstants.BASE_URL + ApiUrls.getPostById(postId), config);
        return res.data;
      } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
      }
    },
  });
};
