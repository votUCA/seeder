import { getDocumentId, getRelatedDocumentIds } from '../../shared'
import faker = require('faker/locale/en_US')

const candidates = new Array(20).fill(null).map(() => ({
  _id: getDocumentId('candidates'),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  election: getRelatedDocumentIds('elections')[0]
}))

export = candidates
