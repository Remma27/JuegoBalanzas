module.exports = {
  dependencies: {
    // gesture-handler 2.16.0 doesn't compile against RN 0.73 and is unused in src.
    'react-native-gesture-handler': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};