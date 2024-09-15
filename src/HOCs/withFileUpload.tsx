import React from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
  isCancel,
  isInProgress,
} from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

export default (
  WrappedComponent: any,
  setSelectedFiles: (files: DocumentPickerResponse[]) => void,
) => {
  const formatFilesRep = (uploaded: DocumentPickerResponse[]) => {
    const validFileSizes = uploaded?.every(
      (fileResp: DocumentPickerResponse) => {
        const fileSize = fileResp.size; // size is in KB
        const sizeInMB = fileSize ? fileSize / 1e6 : 0; // 1 MB = 1e+6 KB

        return sizeInMB <= 100;
      },
    );

    if (!validFileSizes) {
      Toast.show({
        position: 'bottom',
        type: 'tomatoToast',
        text2: 'Cannot upload a file with more than 100 MB size',
      });

      return;
    }

    setSelectedFiles(uploaded);
  };

  const handleError = (err: unknown) => {
    if (isCancel(err)) {
      console.warn('cancelled');
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  const handleFileUpload = () => {
    DocumentPicker.pick({
      allowMultiSelection: false,
      // validation for file type
      type: [
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
        DocumentPicker.types.xls,
        DocumentPicker.types.xlsx,
        DocumentPicker.types.pdf,
        DocumentPicker.types.images,
      ],
    })
      .then(formatFilesRep)
      .catch(handleError);
  };

  const handlePreviewFile = async (url: string) => {
    if (!url) {
      console.warn('Warning: file url is not present');
      return;
    }

    let filename = url.replace(/^.*[\\/]/, '');

    const localFile = `${RNFS.DocumentDirectoryPath}/${
      filename || 'file-name'
    }`;

    const options = {
      fromUrl: url,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() =>
        FileViewer.open(localFile, {
          onDismiss: () => {},
        }),
      )
      .then(() => {})
      .catch(() => {
        console.log('File Preview error');
      });
  };

  const hocComponent = ({...props}) => (
    <WrappedComponent {...props} {...{handleFileUpload, handlePreviewFile}} />
  );

  return hocComponent;
};
