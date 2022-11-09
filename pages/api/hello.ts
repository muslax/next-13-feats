import clientPromise from 'lib/mongodb'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client =  await clientPromise
  const db = client.db('sample_mflix')
  const collection = client.db('sample_mflix').collection('movies')

  const rs = await collection.find({}, {limit: 10}).toArray()
  // @ts-ignore
  res.status(200).json(rs)
}
