import {StyleSheet, View} from 'react-native';
import React, {memo, useEffect} from 'react';
import {Image, ScreenUtils} from 'airtour-components';

export const REPLY_LIST_ITEM_IMAGE_WIDTH = ScreenUtils.width * 0.5;
export const REPLY_LIST_ITEM_IMAGE_HEIGHT = REPLY_LIST_ITEM_IMAGE_WIDTH * 0.6;

const MessageMediaFooter = memo((props: any) => {
  const [isShowing, setShowing] = React.useState(false);

  const {user} = props;
  const image = user?.avatar;

  useEffect(() => {
    if (image) {
      setShowing(true);
    } else {
      setShowing(false);
    }
  }, [image]);

  return (
    <View>
      {isShowing &&
        image(
          <Image
            source={{uri: user.avatar}}
            style={StyleSheet.flatten([
              styles.messageImageContainerStyle,
              styles.messageImageStyle,
            ])}
          />,
        )}
    </View>
  );
});

const styles = StyleSheet.create({
  messageImageContainerStyle: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  messageImageStyle: {
    marginTop: 8,
    width: REPLY_LIST_ITEM_IMAGE_WIDTH,
    height: REPLY_LIST_ITEM_IMAGE_HEIGHT,
  },
});

export default MessageMediaFooter;
