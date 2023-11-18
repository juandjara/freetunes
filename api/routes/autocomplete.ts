import axios from 'axios'
import { Request, Response } from 'express'
import config from '../lib/config'

export default async function autocomplete(req: Request, res: Response) {
  const url = config.autocompleteUrl + req.query.q
  axios({
    url,
    method: 'get',
    responseType: 'stream'
  })
    .then((completionRes) => {
      completionRes.data.pipe(res)
    })
    .catch((err) => {
      res.status(500).json(err)
    })
}
