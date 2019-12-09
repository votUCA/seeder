import { getObjectId } from 'mongo-seeding'
import { ObjectId } from 'mongodb'
import faker = require('faker/locale/en_US')

const collections: { [key: string]: ObjectId[] } = {}

export const getDocumentId = (collection: string) => {
  if (collection in collections) {
    collections[collection].push(
      getObjectId(`${collection}-${collections[collection].length}`)
    )
  } else {
    collections[collection] = [getObjectId(`${collection}-0`)]
  }
  return collections[collection].slice(-1)[0]
}

export const getRelatedDocumentIds = (
  collection: string,
  size: number | 'random' = 1
) =>
  new Array(
    size === 'random'
      ? faker.random.number(collections[collection].length)
      : size
  )
    .fill(null)
    .map(() => faker.random.arrayElement(collections[collection]))

export const getRadomArrayElements = <T>(arr: T[]) => {
  return new Array(faker.random.number(arr.length))
    .fill(null)
    .map(() => faker.random.arrayElement(arr))
}
