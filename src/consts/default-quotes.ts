import {IQuote} from '../interfaces/quote.interface';

export const DEFAULT_QUOTES: IQuote[] = [
  {
    id: 1,
    originalId: 1,
    quote: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
  },
  {
    id: 2,
    originalId: 2,
    quote: 'Technology is a useful servant but a dangerous master.',
    author: 'Christian Lous Lange',
  }
];


export const QUOTE_STUB: IQuote = {
  id: 0,
  originalId: 0,
  quote: 'Loading...',
  author: 'Loading...',
}
