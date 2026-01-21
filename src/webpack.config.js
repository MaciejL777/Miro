const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

console.log("testy czy jest wgrany");

module.exports = async function (env, argv) {
  // 1. Pobierz domyślną konfigurację Webpacka od Expo
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ścieżka do modułu canvaskit-wasm
  const canvasKitPath = path.dirname(require.resolve('canvaskit-wasm'));

  // 2. Skonfiguruj CopyWebpackPlugin, aby kopiował plik canvaskit.wasm
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(canvasKitPath, 'bin/canvaskit.wasm'),
          to: config.output.path, // Kopiuj do folderu wyjściowego (np. web-build)
        },
      ],
    })
  );

  // 3. Dodaj to, aby serwer deweloperski poprawnie serwował plik .wasm
  config.devServer = {
    ...config.devServer,
    static: {
      ...config.devServer.static,
      directory: config.output.path,
    },
  };

  // 4. Zwróć zmodyfikowaną konfigurację
  return config;
};