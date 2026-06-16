import { defineConfig } from 'vite';

// Relative base lets the same build work whether deployed to GitHub Pages
// at /<repo-name>/ or to a custom domain at /.
export default defineConfig({
	base: './',
});
