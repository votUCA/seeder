import { getDocumentId, getRelatedDocumentIds } from '../../shared'
import faker = require('faker/locale/en_US')

const descriptions = ['Elecciones Rectorado ESI', 'Elección delegados/as', 'Votación limpiadoras', 'Elección Dirección ESI']

const elections = {
  _id: getDocumentId('elections'),
  start: faker.date.soon(),
  end: faker.date.soon(30),
  description: faker.helpers.replaceSymbolWithNumber(
    faker.random.arrayElement(descriptions)),
  census: getRelatedDocumentIds('census')
}

export = elections
