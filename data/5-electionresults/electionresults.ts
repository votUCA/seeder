import { getDocumentId, getRelatedDocumentIds } from '../../shared'

const electionReults = new Array(20).fill(null).map(() => ({
  _id: getDocumentId('electionresults'),
  votes: 0,
  candidate: getRelatedDocumentIds('candidates')[0],
  census: getRelatedDocumentIds('censuses')[0],
  election: getRelatedDocumentIds('elections')[0]
}))

export = electionReults
