import {MMKV} from 'react-native-mmkv';

const mmkv = new MMKV();

export const STORAGE_KEYS = {
  POSTS_CACHE_KEY: 'posts',
  POSTS_STORAGE_KEY: 'offline_posts',
  PUBLISHED_POSTS_STORAGE_KEY: 'published_posts',
  DRAFT_POSTS_STORAGE_KEY: 'draft_posts',
  NEW_POSTS_CACHE_KEY: 'new_offline_posts',
  EDIT_POSTS_CACHE_KEY: 'edit_offline_posts',
  DELETE_POSTS_CACHE_KEY: 'delete_offline_posts',
};

// Utility functions for local storage management
export const getPostsFromStorage = () => {
  const postsJson = mmkv.getString(STORAGE_KEYS.POSTS_STORAGE_KEY);
  return postsJson ? JSON.parse(postsJson) : [];
};

export const getPublishedPostsFromStorage = () => {
  const postsJson = mmkv.getString(STORAGE_KEYS.PUBLISHED_POSTS_STORAGE_KEY);
  return postsJson ? JSON.parse(postsJson) : [];
};

export const setPublishedPostsInStorage = (posts: any[]) => {
  mmkv.set(STORAGE_KEYS.PUBLISHED_POSTS_STORAGE_KEY, JSON.stringify(posts));
};

export const getDraftPostsFromStorage = () => {
  const postsJson = mmkv.getString(STORAGE_KEYS.DRAFT_POSTS_STORAGE_KEY);
  return postsJson ? JSON.parse(postsJson) : [];
};

export const setDraftPostsInStorage = (posts: any[]) => {
  mmkv.set(STORAGE_KEYS.DRAFT_POSTS_STORAGE_KEY, JSON.stringify(posts));
};

export const setPostsInStorage = (posts: any[]) => {
  mmkv.set(STORAGE_KEYS.POSTS_STORAGE_KEY, JSON.stringify(posts));
};

export const getNewPostsFromStorage = () => {
  return JSON.parse(mmkv.getString(STORAGE_KEYS.NEW_POSTS_CACHE_KEY) || '[]');
};

export const getEditPostsFromStorage = () => {
  return JSON.parse(mmkv.getString(STORAGE_KEYS.EDIT_POSTS_CACHE_KEY) || '[]');
};

export const getDeletePostsFromStorage = () => {
  return JSON.parse(
    mmkv.getString(STORAGE_KEYS.DELETE_POSTS_CACHE_KEY) || '[]',
  );
};

export const clearNewPostsFromStorage = () => {
  mmkv.delete(STORAGE_KEYS.NEW_POSTS_CACHE_KEY);
};

export const clearEditPostsFromStorage = () => {
  mmkv.delete(STORAGE_KEYS.EDIT_POSTS_CACHE_KEY);
};

export const clearDeletePostsFromStorage = () => {
  mmkv.delete(STORAGE_KEYS.DELETE_POSTS_CACHE_KEY);
};
