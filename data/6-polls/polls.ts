import { getDocumentId, getRelatedDocumentIds } from '../../shared'
import faker = require('faker/locale/en_US')

const polls = new Array(22).fill(null).map(() => ({
  _id: getDocumentId('polls'),
  censuses: getRelatedDocumentIds('censuses', 'random'),
  options: new Array(4)
    .fill(null)
    .map(() => ({ _id: getDocumentId('options'), text: faker.random.words() })),
  start: faker.date.soon(),
  end: faker.date.soon(),
  description: faker.lorem.paragraph(),
  question: faker.lorem.sentence()
}))

export = polls
