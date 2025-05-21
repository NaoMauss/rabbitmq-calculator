import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['README.md'],
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': 'off',
      'ts/consistent-type-imports': 'off',
      'ts/no-empty-object-type': 'off',
      'ts/no-namespace': 'off',
      'antfu/no-top-level-await': 'off',
      'antfu/top-level-function': 'off',
      'no-console': 'off',
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/console': 'off',
      'node/prefer-global/process': 'off',
    },
  },
})
