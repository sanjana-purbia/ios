import React, {useEffect, useRef, useState} from 'react';
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
  Platform,
  KeyboardAvoidingView,
  Keyboard,
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
import {showErrorToast, showSuccessToast} from '@src/utility/toast';

interface EditScreenProps {
  post: any;
  isEditDisabled: Boolean;
}

const Edit: React.FC<EditScreenProps> = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const richText = useRef<RichEditor>(null);
  const {isEditDisabled} = route?.params || {};
  const {imageUrl, title, category, content, id} = route?.params?.post || {};
  const [richImg, setRichImg] = useState(imageUrl);
  const [richTitle, setRichTitle] = useState(title);
  const [richCategory, setRichCategory] = useState(category);
  const [descHTML, setDescHTML] = useState(content);
  const [showDescError, setShowDescError] = useState(false);

  // Use the provided hooks
  const {data: post, isLoading, isError, refetch} = usePostQuery(id);
  const editPostMutation = useEditPostMutation();
  const deletePostMutation = useDeletePostMutation();

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch, route]);

  useEffect(() => {
    if (post) {
      setRichImg(post.imageUrl);
      setRichTitle(post.title);
      setRichCategory(post.category);
      setDescHTML(post.content);
    }
  }, [post, route]);

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
    } else {
      const updatedPost: Post = {
        id: id,
        ...(richImg? {imageUrl: richImg}: {}),
        title: richTitle || 'Untitled',
        content: descHTML || 'No content',
        date: new Date().toISOString(),
        category: richCategory || 'News',
        isComplete: complete,
      };
      editPostMutation.mutate(updatedPost, {
        onSuccess: () => {
          showSuccessToast('Blog updated successfully');
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
            deletePostMutation.mutate(id, {
              onSuccess: () => {
                showSuccessToast('Blog deleted successfully');
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={viewStyles.container}>
      <ScreenHeader title={isEditDisabled ? 'View Blog' : 'Edit Blog'} />
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Pressable onPress={() => Keyboard.dismiss()}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Image url"
              onChangeText={setRichImg}
              value={richImg}
              editable={!isEditDisabled}
            />
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={setRichTitle}
              value={richTitle}
              editable={!isEditDisabled}
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
              disabled={isEditDisabled}
            />
            <RichToolbar
              editor={richText}
              selectedIconTint="#873c1e"
              iconTint="#312921"
              disabled={isEditDisabled}
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
            editable={!isEditDisabled}
          />
          {isEditDisabled ? null : (
            <>
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
                  <Text style={styles.buttonText}>Blogs list</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Edit;
