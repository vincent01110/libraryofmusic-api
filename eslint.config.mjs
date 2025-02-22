import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';


/** @type {import('eslint').Linter.Config[]} */
export default [
    {files: ['**/*.{js,mjs,cjs,ts}']},
    {languageOptions: { globals: {...globals.browser, ...globals.node}  }},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    js.configs.recommended,
    {
        rules: {
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            indent: ['error', 4],
        }
    }
];