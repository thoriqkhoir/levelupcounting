/**
 * Tailwind CSS configuration (minimal) — extends font families
 */
module.exports = {
  content: [
    './resources/views/**/*.blade.php',
    './resources/css/**/*.css',
    './resources/js/**/*.js',
    './resources/js/**/*.ts',
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sinteca', 'Instrument Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sinteca: ['Sinteca', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
