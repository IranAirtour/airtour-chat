import React, {useMemo} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {
  Avatar,
  Button,
  Header,
  Icon,
  ScreenUtils,
  Text,
  useThemeColors,
  flatten,
  GlobalStyles,
} from 'airtour-components';
import {styles} from './styles';
import {IGroupItem} from '../../model/Chat/Group';

export type IChatHeaderPressType = {
  group: IGroupItem;
};

interface IHeaderProps {
  group?: IGroupItem | null;
  onPress?: (params: IChatHeaderPressType) => void;
  onBackPress?: () => void;
}
const HIT_SLOP = {
  top: 20,
  bottom: 20,
  right: ScreenUtils.w(70),
  left: 0,
};

const ScreenHeader: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const {group, onPress, onBackPress} = props;

  const {_id, title = '', icon, membersCount} = group || {};
  const themeColors = useThemeColors();

  // const groupMembersMemo = useMemo(() => {
  //   return groupMemberSelectors
  //     .selectAll(store.getState())
  //     .filter(value => value.groupSequentialId === group?._id);
  // }, [group?._id]);

  const avatarTitle = useMemo(() => {
    const titleArray = title?.split(' ') || '';
    return titleArray[0] || '' + titleArray[1] || '';
  }, [title]);

  return (
    <Header
      leftComponent={
        <View style={flatten([GlobalStyles.flexRow])}>
          <Button
            icon={<Icon name={'arrow-back'} type={'ionicon'} size={25} />}
            onPress={onBackPress}
            containerStyle={flatten([GlobalStyles.fullCenter])}
          />
          <TouchableWithoutFeedback
            hitSlop={HIT_SLOP}
            onPress={() =>
              onPress({
                group: {
                  _id,
                  title,
                  icon,
                  membersCount,
                },
              })
            }>
            <View
              style={flatten([
                GlobalStyles.flexRow,
                {
                  justifyContent: 'center',
                  alignSelf: 'flex-start',
                  marginStart: 0,
                },
              ])}>
              <View
                style={flatten([
                  GlobalStyles.flexRow,
                  GlobalStyles.fullCenter,
                ])}>
                <Avatar
                  title={`${avatarTitle[0] || ''}${avatarTitle[1] || ''}`}
                  size="medium"
                  borderRadius={8}
                  containerStyle={styles.flightImage}
                  source={{
                    uri: `${icon || ''}`,
                  }}
                  activeOpacity={0.7}
                />
                {/*<Image*/}
                {/*  source={icon ? {uri: icon || ''} : images.plane}*/}
                {/*  containerStyle={styles.flightImage}*/}
                {/*/>*/}
                <View
                  style={flatten([
                    GlobalStyles.flexColumn,
                    {paddingHorizontal: 8},
                  ])}>
                  <Text
                    h7
                    style={flatten([
                      styles.groupTitle,
                      {color: themeColors.textBlack},
                    ])}>
                    {group?.title || ' '}
                  </Text>
                  <Text h9 style={styles.memberTextStyle}>
                    {membersCount || ' '} Members
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      }
      centerContainerStyle={{flex: 0}}
    />
  );
};

export {ScreenHeader};
