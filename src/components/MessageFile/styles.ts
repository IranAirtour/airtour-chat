import { StyleSheet } from 'react-native';
import { FontFamily, ScreenUtils } from 'airtour-components';

export const FILE_IMAGE_WIDTH = 45;
export const IMAGE_WIDTH = 45;

export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#F3F7FC',
    borderRadius: 4,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileImageContainerStyle: {
    width: FILE_IMAGE_WIDTH,
    height: FILE_IMAGE_WIDTH,
    borderRadius: FILE_IMAGE_WIDTH / 2,
    overflow: 'hidden',
    backgroundColor: '#D6E6F5',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
    marginHorizontal: 1,
    padding: 0,
  },
  fileInfoContainer: {
    paddingHorizontal: 8,
    paddingTop: 3,
    flex: 1,
  },
  fileImageStyle: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
  },
  fileNameText: {
    fontSize: 12,
    fontFamily: FontFamily.NunitoBold,
    color: '#121212',
    paddingRight: 5,
    maxWidth: ScreenUtils.width * 0.4,
    marginBottom: 0,
  },
  fileExtensionText: {
    fontSize: 10,
    fontFamily: FontFamily.Nunito,
    color: 'gray',
  },
  fileSizeText: {
    fontSize: 10,
    fontFamily: FontFamily.Nunito,
    color: 'gray',
  },
  progressContainer: {
    alignSelf: 'flex-start',
    height: FILE_IMAGE_WIDTH * 0.5,
  },
  progressText: {
    color: '#525252',
    fontFamily: FontFamily.Nunito,
    fontSize: 9,
  },
});
