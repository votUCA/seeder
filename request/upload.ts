/* eslint-disable */
import axios from 'axios'
import fs = require('fs')
import path = require('path')
import FormData = require('form-data')

export async function uploadFile(
  endpoint: string,
  authorization: object,
  file: string
): Promise<string> {
  const mutation = {
    query: /* GraphQL */ `
      mutation($file: Upload!) {
        uploadFile(file: $file)
      }
    `,
    variables: {
      file: null
    }
  }

  const map = {
    0: ['variables.file']
  }

  const fd = new FormData()
  fd.append('operations', JSON.stringify(mutation))
  fd.append('map', JSON.stringify(map))
  fd.append(
    '0',
    fs.createReadStream(`${__dirname}/${file}`),
    path.basename(file)
  )

  const res: any = await axios.post(endpoint, fd, {
    headers: {
      ...authorization,
      ...fd.getHeaders()
    }
  })
  return res.name
}
