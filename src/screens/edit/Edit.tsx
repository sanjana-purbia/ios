import React, {useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {useNavigation, useRoute} from '@react-navigation/native';
import {styles} from './styles';
import {
  useDeletePostMutation,
  useEditPostMutation,
  usePostQuery,
} from '@src/network/hooks/usePosts';
import {ROUTES_CONSTANTS} from '@src/config/RoutesConstants';
import {viewStyles} from '@src/utility/ViewStyles';
import {ScreenHeader} from '@src/components/absoluteBackHeader';

interface EditScreenProps {
  post: any;
}

const Edit: React.FC<EditScreenProps> = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const richText = useRef<RichEditor>(null);
  const {image, title, category, content, _id} = route?.params?.post || {};
  const [richImg, setRichImg] = useState(image);
  const [richTitle, setRichTitle] = useState(title);
  const [richCategory, setRichCategory] = useState(category);
  const [descHTML, setDescHTML] = useState(content);
  const [showDescError, setShowDescError] = useState(false);

  // Use the provided hooks
  const {data: post, isLoading, isError} = usePostQuery(_id);
  const editPostMutation = useEditPostMutation();
  const deletePostMutation = useDeletePostMutation();

  React.useEffect(() => {
    if (post) {
      setRichImg(post.image);
      setRichTitle(post.title);
      setRichCategory(post.category);
      setDescHTML(post.content);
    }
  }, [post]);

  const richTextHandle = (descriptionText: string) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML('');
    }
  };

  const submitContentHandle = (complete: boolean) => {
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, '').trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, '').trim();

    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
    } else {
      const updatedPost: Post = {
        postid: _id,
        image: richImg || 'https://www.w3schools.com/css/img_5terre.jpg',
        title: richTitle || 'Untitled',
        content: descHTML || 'No content',
        date: new Date().toISOString(),
        category: richCategory || 'News',
        isComplete,
      };
      editPostMutation.mutate(updatedPost, {
        onSuccess: () => {
          navigation.navigate(ROUTES_CONSTANTS.HOME_SCREEN);
        },
        onError: error => {
          console.error('Error updating post:', error);
          Alert.alert('Error', 'Failed to update post. Please try again.');
        },
      });
    }
  };

  const submitContentHandleAsDelete = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () =>
            deletePostMutation.mutate(_id, {
              onSuccess: () => {
                navigation.navigate(ROUTES_CONSTANTS.HOME_SCREEN);
              },
              onError: error => {
                console.error('Error deleting post:', error);
                Alert.alert(
                  'Error',
                  'Failed to delete post. Please try again.',
                );
              },
            }),
        },
      ],
      {cancelable: false},
    );
  };

  const handleHead =
    (level: number) =>
    ({tintColor}: {tintColor: string}) =>
      <Text style={{color: tintColor}}>{`H${level}`}</Text>;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading post. Please try again.</Text>;
  }

  return (
    <View style={viewStyles.container}>
      <ScreenHeader title="Edit" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{flex: 1}}>
          <View style={styles.container}>
            <Pressable onPress={() => richText.current?.dismissKeyboard()}>
              <Text style={styles.headerStyle}>Edit Post</Text>
            </Pressable>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Image url"
                onChangeText={setRichImg}
                value={richImg}
              />
              <TextInput
                style={styles.input}
                placeholder="Title"
                onChangeText={setRichTitle}
                value={richTitle}
              />
            </View>
            <View style={styles.richTextContainer}>
              <RichEditor
                ref={richText}
                onChange={richTextHandle}
                placeholder="Write your cool content here :)"
                androidHardwareAccelerationDisabled={true}
                style={styles.richTextEditorStyle}
                initialHeight={250}
                initialContentHTML={descHTML}
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
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => submitContentHandle(false)}>
                <Text style={styles.buttonText}>Save as Draft</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => submitContentHandle(true)}>
                <Text style={styles.buttonText}>Publish</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.button}
                onPress={submitContentHandleAsDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate(ROUTES_CONSTANTS.HOME_SCREEN)
                }>
                <Text style={styles.buttonText}>Posts list</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default Edit;
