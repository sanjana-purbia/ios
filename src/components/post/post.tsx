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
  post: {
    id: string;
    imageUrl: string;
    title: string;
    content: string;
    isComplete: boolean;
  };
  isEditDisabled: Boolean;
  onEdit: (post: any) => void;
}
const defaultImg = require('@assets/images/blog.jpg');

const Post: React.FC<PostProps> = ({post, onEdit, isEditDisabled}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => setIsLiked(!isLiked);

  const handleEdit = () => {
    onEdit(post, isEditDisabled);
  };

  const blogImg = post?.imageUrl ? {uri: post?.imageUrl} : defaultImg;
  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleEdit}>
          <Image style={styles.image} source={blogImg} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.header}>{post.title}</Text>
          </TouchableOpacity>
          <Text style={styles.category}>
            {post.isComplete ? 'Published' : 'Draft'}
          </Text>
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
      </View>
    </ScrollView>
  );
};

export default Post;