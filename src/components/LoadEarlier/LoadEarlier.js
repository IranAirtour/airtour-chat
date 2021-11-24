import React from 'react';
import {Text} from 'airtour-components';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    width: '40%',
  },
  text: {
    // backgroundColor: Color.backgroundTransparent,
    // color: Color.white,
    fontSize: 12,
  },
  activityIndicator: {},
});
class LoadEarlier extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props?.containerStyle]}
        onPress={() => {
          if (this.props?.onLoadEarlier) {
            this.props.onLoadEarlier();
          }
        }}
        disabled={this.props.isLoadingEarlier === true}
        accessibilityTraits="button">
        <View style={[styles.wrapper, this.props?.wrapperStyle]}>
          {this.props?.isLoadingEarlier === false ? (
            <Text style={[styles.text, this.props.textStyle]}>
              {this.props?.label ?? ''}
            </Text>
          ) : (
            <ActivityIndicator
              color={this.props?.activityIndicatorColor}
              size={this.props?.activityIndicatorSize}
              style={[
                styles.activityIndicator,
                this.props?.activityIndicatorStyle,
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
LoadEarlier.defaultProps = {
  onLoadEarlier: () => {},
  isLoadingEarlier: false,
  label: 'Load earlier messages',
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  activityIndicatorStyle: {},
  activityIndicatorColor: 'white',
  activityIndicatorSize: 'small',
};
export {LoadEarlier};
//# sourceMappingURL=LoadEarlier.js.map
