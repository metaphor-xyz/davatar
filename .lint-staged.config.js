module.exports = {
  '**/*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix --max-warnings 0'],
  'app/**/*.{js,jsx,ts,tsx}': [() => "bash -c 'cd app && tsc'"],
};
