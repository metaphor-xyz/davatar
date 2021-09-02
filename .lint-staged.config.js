module.exports = {
  "drop_*/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings 0",
  ],
  "drop_avatars/app/**/*.{js,jsx,ts,tsx}": [
    () => "bash -c 'cd drop_avatars/app && tsc'",
  ]
};
