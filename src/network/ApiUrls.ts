const ApiUrls = {
  // Authentication
  login: 'auth/login',
  register: 'auth/register',
  refreshToken: 'auth/refresh-token',
  logout: 'auth/logout',

  // Posts
  getAllPosts: 'posts',
  getPostById: (id: string) => `posts/${id}`,
  createPost: 'posts',
  updatePost: (id: string) => `posts/${id}/edit`,
  deletePost: (id: string) => `posts/${id}/delete`,

  // User
  getUserProfile: 'user/profile',
  updateUserProfile: 'user/profile/update',

  // Categories
  getCategories: 'categories',

  // Comments (if your app has this feature)
  getComments: (postId: string) => `posts/${postId}/comments`,
  addComment: (postId: string) => `posts/${postId}/comments`,

  // Search
  search: 'search',

  // Any other endpoints your app might need
};

export default ApiUrls;