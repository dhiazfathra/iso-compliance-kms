import next from 'eslint-config-next'

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'src/payload-types.ts',
      '.design/**',
      '.claude/**',
      '.agents/**',
    ],
  },
  ...next,
]

export default config
