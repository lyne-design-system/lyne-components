module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-syntax-jsx',
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h',
      },
    ],
    [
      '@babel/plugin-proposal-private-property-in-object',
      {
        loose: true,
      },
    ],
  ],
};
