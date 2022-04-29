module.exports = {
    extends: [
        'react-app',
        'airbnb',
        'plugin:jsx-a11y/recommended',
    ],
    plugins: [
        'jsx-a11y',
    ],
    rules: {
        'import/no-extraneous-dependencies': 0, // todo
        'no-shadow': 0,
        'spaced-comment': 0,
        'no-await-in-loop': 0,
        'no-case-declarations': 0,
        'react/no-array-index-key': 0,
        'react/button-has-type': 0,
        'no-nested-ternary': 0,
        indent: ['warn', 4, { SwitchCase: 1 }],
        'react/jsx-indent': ['warn', 4],
        'react/jsx-indent-props': ['warn', 4],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'react/jsx-props-no-spreading': 0,
        'react/forbid-prop-types': 1,
        'react/react-in-jsx-scope': 0,
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/no-static-element-interactions': 0,
        'jsx-a11y/no-noninteractive-element-interactions': 0,
        'linebreak-style': 0,
        'no-underscore-dangle': 0,
        'no-return-assign': 0,
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        'max-len': ['warn', { code: 130 }],
        'arrow-body-style': 0,
        'react/jsx-one-expression-per-line': 0,
        'consistent-return': 0,
        'no-param-reassign': 0,
        'import/prefer-default-export': 0,
        'no-plusplus': 0,
        'object-curly-spacing': 2,
        'import/no-unresolved': ['error', { ignore: ['.src/'] }],
        'lines-between-class-members': 0,
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [['@', './src']],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    overrides: [
        {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
            },
            files: ['**/*.ts?(x)'],
            extends: [
                'plugin:@typescript-eslint/recommended',
            ],
            parser: '@typescript-eslint/parser',
            rules: {
                camelcase: 0,
                'no-use-before-define': 0,
                'no-prototype-builtins': 1,
                'react/prop-types': 0,
                'react/jsx-pascal-case': 1,
                'react/destructuring-assignment': 1,
                'react-hooks/rules-of-hooks': 1,
                'import/extensions': 0,
                '@typescript-eslint/no-empty-function': 0,
                '@typescript-eslint/no-explicit-any': 0,
                '@typescript-eslint/explicit-function-return-type': 0,
                '@typescript-eslint/no-non-null-assertion': 0,
                '@typescript-eslint/no-empty-interface': 0,
                '@typescript-eslint/camelcase': 0,
                '@typescript-eslint/ban-ts-ignore': 0,
                '@typescript-eslint/ban-ts-comment': 0,
                '@typescript-eslint/ban-types': 0,
            },
            plugins: ['@typescript-eslint'],
            settings: {
                react: { version: 'detect' },
            },
        },
        {
            files: [
                '**/*.stories.*',
            ],
            rules: {
                'import/no-anonymous-default-export': 'off',

            },
        },
    ],
};
