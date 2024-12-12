import { setDraftPostsInStorage, setPostsInStorage, setPublishedPostsInStorage } from "@src/network/storage/postsStorage";
import { Platform } from "react-native";

export const isIos = Platform.OS === 'ios'

export const isValidUrl = (str: string) => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  );

  return !!pattern.test(str);
};

export const dispalyDateFormat = (date: Date) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric' });
  return formattedDate;
};


export const processPosts = (posts: any[]) => {
  // Sort posts by creation date
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Separate published and draft posts
  const publishedPosts = sortedPosts.filter((post: any) => post.isComplete);
  const draftPosts = sortedPosts.filter((post: any) => !post.isComplete);

  // Save to storage
  setPostsInStorage(sortedPosts);
  setPublishedPostsInStorage(publishedPosts);
  setDraftPostsInStorage(draftPosts);

  return {
    allPosts: sortedPosts,
    publishedPosts,
    draftPosts
  };
};
