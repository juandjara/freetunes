import express from 'express'
import ViteExpress from 'vite-express'
import pkg from '../package.json' assert { type: 'json' }
// @ts-ignore
import cors from 'cors'
// @ts-ignore
import sendSeekable from 'send-seekable'
import { stream } from './routes/stream'
import download from './routes/download'
import autocomplete from './routes/autocomplete'
import dotenv from 'dotenv'

dotenv.config()
process.env.VITE_INVIDIOUS_URL = process.env.INVIDIOUS_URL

const app = express()

app.set('json spaces', 2)
app.use(cors())
app.use(sendSeekable)

app.get('/api', (_, res) => {
  res.send({
    name: pkg.name,
    description: pkg.description,
    version: pkg.version
  })
})

app.get('/api/stream/:ytid', stream)
app.get('/api/dl/:ytid', download)
app.get('/api/autocomplete', autocomplete)

const PORT = Number(process.env.PORT || 3000)

ViteExpress.listen(app, PORT, () => {
  console.log(`🚀 Server is listening on port`, PORT)
})
