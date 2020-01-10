import { getDocumentId, getRelatedDocumentIds } from '../../shared'

const pollresults = new Array(1000).fill(null).map(() => ({
  _id: getDocumentId('pollresults'),
  votes: 0,
  option: getRelatedDocumentIds('options')[0],
  census: getRelatedDocumentIds('censuses')[0],
  poll: getRelatedDocumentIds('polls')[0]
}))

export = pollresults
