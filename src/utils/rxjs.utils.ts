import {z} from 'zod';
import {map, pipe} from 'rxjs';

export function verifyResponseType<T extends z.ZodTypeAny>(zodObj: T) {
  return pipe(map((response) => zodObj.parse(response)));
}
