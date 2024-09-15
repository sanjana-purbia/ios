import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {styles} from './styles';

interface PostProps {
  post: {
    _id: string;
    image: string;
    title: string;
    desc: string;
    complete: boolean;
  };
  onEdit: (post: any) => void
}

const Post: React.FC<PostProps> = ({ post, onEdit }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => setIsLiked(!isLiked);

  const handleEdit = () => {
    onEdit(post)
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleEdit}>
          <Image style={styles.image} source={{ uri: post.image }} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.header}>{post.title}</Text>
          </TouchableOpacity>
          <Text style={styles.category}>
            {post.complete ? 'Published' : 'Draft'}
          </Text>
          <TouchableOpacity onPress={handleEdit}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};


export default Post;