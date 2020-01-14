import { GraphQLClient, request } from 'graphql-request'
import faker = require('faker/locale/en_US')
const argv = require('yargs').argv

function randombetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generate(max: number, thecount: number) {
  const r = []
  let currsum = 0
  for (let i = 0; i < thecount - 1; i++) {
    r[i] = randombetween(1, max - (thecount - i - 1) - currsum)
    currsum += r[i]
  }
  r[thecount - 1] = max - currsum
  return r
}

const loginQuery = /* GraphQL */ `
  mutation login($input: LoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`

const createElection = /* GraphQL */ `
  mutation election($input: ElectionInput!) {
    createElection(input: $input) {
      start
      end
    }
  }
`

const createPoll = /* GraphQL */ `
  mutation poll($input: PollInput!) {
    createPoll(input: $input) {
      id
    }
  }
`

const createUser = /* GraphQL */ `
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      id
    }
  }
`

const colegiateBodyQuery = /* GraphQL */ `
  query collegiateBodies {
    collegiateBodies {
      id
      name
    }
  }
`

const usersQuery = /* GraphQL */ `
  query users {
    users {
      uid
      firstName
      lastName
      dni
      colegiateBody {
        id
        name
      }
    }
  }
`

function groupBy(list, keyGetter) {
  const map = new Map()
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

const groups = ['PDVP', 'PNDVP', 'PDINVP', 'PAS', 'ALU']
const locations = ['JEREZ', 'PUERTO REAL', 'CASEM', 'CADIZ', 'ALGECIRAS']

async function main() {
  const endpoint = 'http://localhost:7000/graphql'

  const { login } = await request(endpoint, loginQuery, {
    input: argv.input
  })

  const headers = {
    authorization: `bearer ${login.accessToken}`
  }

  const graphQLClient = new GraphQLClient(endpoint, {
    headers
  })

  if (argv.users) {
    const { collegiateBodies } = await graphQLClient.request(colegiateBodyQuery)

    const baseuid = 20192021
    for (let i = 0; i < 100; i++) {
      await graphQLClient.request(createUser, {
        input: {
          uid: `u${baseuid + i}`,
          dni: `${baseuid + i}u`,
          password: `user${baseuid + i}`,
          firstName: faker.name.findName(),
          lastName: faker.name.lastName(),
          roles: 'VOTER',
          colegiateBody: faker.random.arrayElement<any>(collegiateBodies).id,
          genre: faker.random.arrayElement(['MALE', 'FEMALE', 'OTHER'])
        }
      })
    }
  }

  const users = await graphQLClient.request(usersQuery)
  const grouped = groupBy(users.users, user => user.colegiateBody.name)

  if (argv.polls) {
    for (let i = 0; i < 10; i++) {
      const result = await graphQLClient.request(createPoll, {
        input: {
          description: faker.lorem.paragraph(1),
          start: new Date().toISOString(),
          end: new Date('01/20/2020').toISOString(),
          delegates: [],
          censuses: groups.map(group => ({
            group,
            location: 'ESI',
            date: new Date().toISOString(),
            voters: new Array(faker.random.number(10) + 1)
              .fill(null)
              .map(() => {
                const { colegiateBody, ...voter } = faker.random.arrayElement<
                  any
                >(grouped.get(group))
                return voter
              })
          })),
          question: faker.lorem.sentence(10),
          options: new Array(faker.random.number(5) + 2)
            .fill(null)
            .map(() => faker.lorem.sentence(10)),
          isRealTime: faker.random.boolean()
        }
      })
      console.log(JSON.stringify(result, undefined, 2))
    }
  }

  if (argv.elections) {
    for (let i = 0; i < 10; i++) {
      const numCandidates = faker.random.number(5) + 1
      const result = await graphQLClient.request(createElection, {
        input: {
          description: faker.lorem.paragraph(1),
          start: new Date().toISOString(),
          end: new Date('01/20/2020').toISOString(),
          delegates: [],
          candidates: new Array(faker.random.number(5) + 1)
            .fill(null)
            .map(() => ({
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              about: faker.lorem.paragraph(10)
            })),
          censuses: groups.map(group => ({
            group,
            location: 'ESI',
            date: new Date().toISOString(),
            voters: new Array(faker.random.number(10) + 1)
              .fill(null)
              .map(() => {
                const { colegiateBody, ...voter } = faker.random.arrayElement<
                  any
                >(grouped.get(group))
                return voter
              })
          })),
          maxVotes: faker.random.number(numCandidates) + 1,
          voteWeights: generate(100, groups.length).map((weight, index) => ({
            weight,
            group: groups[index]
          }))
        }
      })
      console.log(JSON.stringify(result, undefined, 2))
    }
  }
}

main()
