import { defineConfig } from 'eslint/config';
import wordpress from '@wordpress/eslint-plugin';

// see docs/eslint.md
const wpRegex = '^@wordpress/';

export default defineConfig( [
	{
		ignores: [
			'**/*.min.js',
			'src/js/',
			'src/js-external/',
			'src/local-db-service/',
			'www/',
		],
	},
	{
		basePath: 'src',
		plugins: {
			wordpress,
		},
		extends: [ wordpress.configs.recommended ],
		settings: {
			'import/internal-regex': wpRegex,
		},
		rules: {
			'import/no-unresolved': [
				'error',
				{
					ignore: [ wpRegex ],
				},
			],
			curly: [ 'error', 'multi-line' ],
		},
	},
] );
