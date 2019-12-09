import { getDocumentId } from '../../shared'
import faker = require('faker/locale/en_US')
import bcrypt = require('bcryptjs')

const uidFormats = ['u########', 'ux#######', 'uy#######', 'uz#######']

type Roles = 'ADMIN' | 'SECRETARY'

const users = new Array(200).fill(null).map((_, idx) => ({
  _id: getDocumentId('users'),
  uid: faker.helpers.replaceSymbolWithNumber(
    faker.random.arrayElement(uidFormats)
  ),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: bcrypt.hashSync(`user-${idx}`, 10),
  roles: [] as Roles[]
}))

users.push({
  _id: getDocumentId('users'),
  uid: 'u20192020',
  firstName: 'votuca',
  lastName: 'admin',
  password: bcrypt.hashSync('votUCA?0!9', 10),
  roles: ['ADMIN']
})

export = users
