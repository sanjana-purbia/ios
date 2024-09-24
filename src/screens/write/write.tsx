import React, {useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {StackNavigationProp} from '@react-navigation/stack';
import {MMKV} from 'react-native-mmkv';
import {styles} from './styles';
import {
  useCreatePostMutation,
  useEditPostMutation,
} from '@src/network/hooks/usePosts';
import {NEW_POSTS_CACHE_KEY} from '@src/network/storage/postsStorage';
import {ScreenHeader} from '@src/components/absoluteBackHeader';
import {viewStyles} from '@src/utility/ViewStyles';
import {ROUTES_CONSTANTS} from '@src/config/RoutesConstants';
import {showErrorToast} from '@src/utility/toast';

const mmkv = new MMKV();

// Define types
type Post = {
  id?: string;
  imageUrl: string;
  title: string;
  content: string;
  date: string;
  category: string;
  isComplete: boolean;
};

type RootStackParamList = {
  Write: {postId?: string} | undefined;
  Posts: undefined;
};

type WriteScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Write'
>;

type WriteProps = {
  navigation: WriteScreenNavigationProp;
  route: {
    params?: {
      postId?: string;
    };
  };
};

export default function Write({navigation, route}: WriteProps) {
  const postId = route.params?.postId;
  const isEditing = !!postId;

  const richText = useRef<RichEditor>(null);
  const [richImg, setRichImg] = useState('');
  const [richTitle, setRichTitle] = useState('');
  const [richCategory, setRichCategory] = useState('');
  const [descHTML, setDescHTML] = useState('');
  const [showDescError, setShowDescError] = useState(false);

  const createPostMutation = useCreatePostMutation();
  const editPostMutation = useEditPostMutation();

  // If editing, fetch the post data and populate the fields
  React.useEffect(() => {
    if (isEditing) {
      // Fetch post data and populate fields
      // This is a placeholder. You should implement the logic to fetch the post data.
      // const post = fetchPost(postId);
      // setRichImg(post.image);
      // setRichTitle(post.title);
      // setRichCategory(post.cat);
      // setDescHTML(post.desc);
    }
  }, [isEditing, postId]);

  const richTextHandle = (descriptionText: string) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML('');
    }
  };

  const submitContent = (complete: boolean) => {
    if (!richTitle.trimStart()) {
      showErrorToast('Title is required');
      return;
    }

    if (!richCategory.trimStart()) {
      showErrorToast('Category is required');
      return;
    }
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, '').trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, '').trim();

    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
      return;
    }

    const newPost: Post = {
      ...(richImg? {imageUrl: richImg}: {}),
      title: richTitle || 'Untitled',
      content: descHTML || 'No content',
      date: new Date().toISOString().split('T')[0],
      category: richCategory || 'News',
      isComplete: complete,
    };

    if (isEditing) {
      editPostMutation.mutate({...newPost, id: postId});
    } else {
      createPostMutation.mutate(newPost);
    }

    // Store the new post in MMKV storage
    const newPosts = JSON.parse(mmkv.getString(NEW_POSTS_CACHE_KEY) || '[]');
    newPosts.push(newPost);
    mmkv.set(NEW_POSTS_CACHE_KEY, JSON.stringify(newPosts));

    navigation.navigate(ROUTES_CONSTANTS.HOME_SCREEN);
  };

  const handleHead =
    (level: number) =>
    ({tintColor}: {tintColor: string}) =>
      <Text style={{color: tintColor}}>{`H${level}`}</Text>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={viewStyles.container}>
      <ScreenHeader title={isEditing ? 'Edit Blog' : 'Create Blog'} />
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Pressable onPress={() => Keyboard.dismiss()}>
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            onChangeText={setRichImg}
            value={richImg}
          />
          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={setRichTitle}
            value={richTitle}
          />
          <View style={styles.richTextContainer}>
            <RichEditor
              ref={richText}
              onChange={richTextHandle}
              placeholder="Write your cool content here :)"
              androidHardwareAccelerationDisabled={true}
              style={styles.richTextEditorStyle}
              initialHeight={250}
            />
            <RichToolbar
              editor={richText}
              selectedIconTint="#873c1e"
              iconTint="#312921"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.setStrikethrough,
                actions.setUnderline,
                actions.checkboxList,
                actions.heading1,
                actions.heading2,
                actions.heading3,
                actions.heading4,
                actions.heading5,
              ]}
              style={styles.richTextToolbarStyle}
              iconMap={{
                [actions.heading1]: handleHead(1),
                [actions.heading2]: handleHead(2),
                [actions.heading3]: handleHead(3),
                [actions.heading4]: handleHead(4),
                [actions.heading5]: handleHead(5),
              }}
            />
          </View>
          {showDescError && (
            <Text style={styles.errorTextStyle}>
              Your content shouldn't be empty 🤔
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Category"
            onChangeText={setRichCategory}
            value={richCategory}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => submitContent(false)}>
            <Text style={styles.buttonText}>Save as Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => submitContent(true)}>
            <Text style={styles.buttonText}>Publish</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(ROUTES_CONSTANTS.HOME_SCREEN)}>
            <Text style={styles.buttonText}>Blogs list</Text>
          </TouchableOpacity>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
