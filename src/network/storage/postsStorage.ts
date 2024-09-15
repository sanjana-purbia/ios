import { MMKV } from 'react-native-mmkv';

const mmkv = new MMKV();

const POSTS_STORAGE_KEY = 'posts';
export const NEW_POSTS_CACHE_KEY = '@new_posts';
export const EDIT_POSTS_CACHE_KEY = '@edit_posts';
export const DELETE_POSTS_CACHE_KEY = '@delete_posts';

export const getPostsFromStorage = () => {
  const postsJson = mmkv.getString(POSTS_STORAGE_KEY);
  return postsJson ? JSON.parse(postsJson) : [];
};

export const setPostsInStorage = (posts: any) => {
  mmkv.set(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

export const getNewPostsFromStorage = () => {
  return JSON.parse(mmkv.getString(NEW_POSTS_CACHE_KEY) || '[]');
};

export const getEditPostsFromStorage = () => {
  return JSON.parse(mmkv.getString(EDIT_POSTS_CACHE_KEY) || '[]');
};

export const getDeletePostsFromStorage = () => {
  return JSON.parse(mmkv.getString(DELETE_POSTS_CACHE_KEY) || '[]');
};

export const clearNewPostsFromStorage = () => {
  mmkv.delete(NEW_POSTS_CACHE_KEY);
};

export const clearEditPostsFromStorage = () => {
  mmkv.delete(EDIT_POSTS_CACHE_KEY);
};

export const clearDeletePostsFromStorage = () => {
  mmkv.delete(DELETE_POSTS_CACHE_KEY);
};