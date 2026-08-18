import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site from /<repo>/. Derive that from the Actions
// environment so a fallback repository name still deploys correctly, while
// local builds and `npm run preview` stay at "/".
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: isGitHubActions && repoName ? `/${repoName}/` : '/',
})
