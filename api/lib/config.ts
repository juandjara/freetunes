import dotenv from 'dotenv'

dotenv.config()

const invidiousURL = process.env.INVIDIOUS_URL

if (!invidiousURL) {
  throw new Error('INVIDIOUS_URL environment variable is not set')
}

export default {
  autocompleteUrl: 'https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=',
  detailUrlTemplate: `${invidiousURL}/api/v1/videos/{id}`
}
