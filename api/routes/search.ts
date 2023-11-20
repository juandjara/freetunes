import axios from 'axios'
import { Request, Response } from 'express'
import config from '../lib/config'

export default async function search(req: Request, res: Response) {
  try {
    const url = `${config.searchUrl}?q=${req.query.q}`
    const { data } = await axios.get(url)
    const json = data
      .filter((d: any) => d.videoId)
      .map((d: any) => {
        return {
          id: d.videoId,
          title: d.title,
          lengthSeconds: d.lengthSeconds,
          image: `https://i.ytimg.com/vi/${d.videoId}/mqdefault.jpg`
        }
      })
    return res.json(json)
  } catch (err) {
    console.error(err)
    return res.status(500).json(err)
  }
}
