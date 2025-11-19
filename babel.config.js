module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'Yoramework.createElement',
        pragmaFrag: 'Yoramework.Fragment',
      },
    ],
  ],
};

