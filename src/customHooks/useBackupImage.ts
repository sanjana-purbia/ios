import {useState} from 'react';

/**
 * custom hook that lets you use a backup
 * image in case the main image (URL) fails to load
 *
 * @param initialImage Image URL
 * @param backUpImage Backup Image URL
 * @returns `[image, loadBackUpImage]` - main image or backup image if main fails, trigger this function in image load error handler
 *
 * @example
 * const [logoImg, loadBackUpImage] = useBackupImage(logo, backupLogo);
 *
 * <Image
 *    source={studyLogo}
 *    style={Styles.imgs}
 *    onError={() => {
 *      loadBackUpImage();
 *    }}
 * />
 */
export const useBackupImage = (initialImage: string, backUpImage: string) => {
  const [image, setImage] = useState(
    initialImage ? {uri: initialImage} : backUpImage,
  );

  const loadBackUpImage = () => {
    setImage(backUpImage);
  };

  return [image, loadBackUpImage];
};
