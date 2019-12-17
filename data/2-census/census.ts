import { getDocumentId, uidFormats } from '../../shared'
import faker = require('faker/locale/en_US')

const groups = ['PDVP', 'PNDVP', 'PDIVP', 'PASC', 'APSC', 'ATC']
const campuses = ['FEF', 'FFL', 'FCCEE', 'FM', 'FCT', 'EIMR', 'EDU', 'EINO', 'EIDEM', 'EPS', 'ESI']

type Voters = {
    uid: string
    firstName: string
    lastName: string
}

const census = groups.map((group) => ({
  _id: getDocumentId('census'),
  group: group,
  date: faker.date.soon(),
  location: faker.random.arrayElement(campuses),
  voters: new Array(30).fill(null).map(() => ({
    uid: faker.helpers.replaceSymbolWithNumber(
      faker.random.arrayElement(uidFormats)),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  })) as Voters []
}))

export = census
