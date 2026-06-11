module.exports = function (source) {
  // @ffmpeg/ffmpeg worker has /* @vite-ignore */ but not /* webpackIgnore: true */
  // Without this, Next.js/webpack intercepts import(_coreURL) and throws
  // "Cannot find module as expression is too dynamic" at runtime.
  return source.replace(
    "/* @vite-ignore */ _coreURL",
    "/* @vite-ignore */ /* webpackIgnore: true */ _coreURL"
  );
};
