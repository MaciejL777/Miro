module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Ważne: 'react-native-reanimated/plugin' musi być ostatni!
      'react-native-reanimated/plugin',
    ],
  };
};