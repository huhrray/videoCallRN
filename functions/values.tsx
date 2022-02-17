
import { Dimensions } from 'react-native';
import { CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const libOptions: ImageLibraryOptions = {
    mediaType: 'photo',
    maxHeight: 500,
    maxWidth: 500,
};
export const camOptions: CameraOptions = {
    mediaType: 'photo',
    maxHeight: 500,
    maxWidth: 500,
    cameraType: 'front',
    saveToPhotos: true
};
