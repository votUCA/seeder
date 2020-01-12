import { GraphQLClient, request } from 'graphql-request'
import faker = require('faker/locale/en_US')

async function main () {
  const endpoint = 'http://localhost:9998/graphql'

  const loginQuery = /* GraphQL */ `
    mutation login($input: LoginInput!) {
      login(input: $input) {
        accessToken
      }
    }
  `

  const { login } = await request(endpoint, loginQuery, {
    input: {
      uid: 'u20192020',
      password: 'votUCA?0!9'
    }
  })

  const headers = {
    authorization: `bearer ${login.accessToken}`
  }

  const graphQLClient = new GraphQLClient(endpoint, {
    headers
  })

  const pedingElections = /* GraphQL */ `
    mutation election($input: ElectionInput!) {
      createElection(input: $input) {
        start
        end
      }
    }
  `
  const pedingPolls = /* GraphQL */ `
  mutation poll($input: PollInput!) {
    createPoll(input: $input) {
      start
      end
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
  const createUserboolean = false
  if (createUserboolean) {
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
          genre: faker.random.arrayElement(['MALE', 'FEMALE', 'OTHER'])
        }
      })
    }
  }

  const groups = ['PDVP', 'PNDVP', 'PDINVP', 'PAS', 'ALU']
  const locations = ['JEREZ', 'PUERTOREAL', 'CASEM', 'CADIZ', 'ALGECIRAS']
  const usersQuery = /* GraphQL */ `
    query users {users{uid firstName lastName dni}}`
  const users = await graphQLClient.request(usersQuery)

  const createPollBoolean = true
  if (createPollBoolean) {
    for (let i = 0; i < 10; i++) {
      const result = await graphQLClient.request(pedingPolls, {
        input: {
          description: faker.lorem.paragraph(100),
          start: new Date().toISOString(),
          end: new Date('01/20/2020').toISOString(),
          isVoteRectify: false,
          delegates: [],
          censuses: locations.map((location) => groups.map(group => ({
            group,
            location,
            date: new Date().toISOString(),
            voters: new Array(faker.random.number(10) + 1).fill(null).map(() => faker.random.arrayElement(users.users))
          }))).reduce((prev, current) => [...prev, ...current]),
          question: faker.lorem.sentence(20),
          options: new Array(faker.random.number(5) + 2).fill(null).map(() =>
            faker.lorem.sentence(20)),
          isRealTime: faker.random.boolean()
        }
      })
      console.log(JSON.stringify(result, undefined, 2))
    }
  }

  const createElectionBoolean = false
  if (createElectionBoolean) {
    for (let i = 0; i < 10; i++) {
      const result = await graphQLClient.request(pedingElections, {
        input: {
          description: faker.lorem.paragraph(100),
          start: new Date().toISOString(),
          end: new Date('01/20/2020').toISOString(),
          isVoteRectify: false,
          delegates: [],
          candidates: new Array(faker.random.number(5) + 1).fill(null).map(() => ({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            about: faker.lorem.paragraph(20)
          })),
          censuses: locations.map((location) => groups.map(group => ({
            group,
            location,
            date: new Date().toISOString(),
            voters: new Array(faker.random.number(10) + 1).fill(null).map(() => faker.random.arrayElement(users.users))
          }))).reduce((prev, current) => [...prev, ...current])
        }
      })
      console.log(JSON.stringify(result, undefined, 2))
    }
  }
}

main()