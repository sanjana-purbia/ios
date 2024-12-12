import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {styles} from './styles';
import AppColors from '@src/utility/AppColors';

interface PostProps {
  post: BlogPost;
  isEditDisabled: Boolean;
  onEdit: (post: any) => void;
}
const defaultImg = require('@assets/images/blog.jpg');

const Post: React.FC<PostProps> = ({post, onEdit, isEditDisabled}) => {
  const handleEdit = () => {
    onEdit(post);
  };

  const blogImg = post?.imageUrl ? {uri: post?.imageUrl} : defaultImg;
  return (
    <TouchableOpacity onPress={handleEdit} style={styles.container}>
      <Image style={styles.image} source={blogImg} />
      <View style={styles.contentContainer}>
        <Text style={styles.header}>{post.title}</Text>
        {/* <Text style={styles.category}>
          {post.isComplete ? 'Published' : 'Draft'}
        </Text> */}
        {isEditDisabled ? null : (
          <TouchableOpacity onPress={handleEdit}>
            <Text
              style={{
                color: AppColors.primary,
                textDecorationLine: 'underline',
              }}>
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Post;
