const invidiousURL = import.meta.env.VITE_INVIDIOUS_URL

if (!invidiousURL) {
  throw new Error('VITE_INVIDIOUS_URL environment variable is not set')
}

export default {
  autocompleteUrl: 'https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=',
  detailUrlTemplate: `${invidiousURL}/api/v1/videos/{id}`,
  searchUrl: `${invidiousURL}/api/v1/search`
}
