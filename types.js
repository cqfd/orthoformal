// @flow

export type Form<+T> = (Status<T> => void) => React$Element<*>

export type Status<+T> = Fresh | Bogus | Ok<T>
type Fresh = { t: 'fresh' }
type Bogus = { t: 'bogus' }
type Ok<+T> = { t: 'ok', value: T }

export const fresh: Fresh = { t: 'fresh' }
export const bogus: Bogus = { t: 'bogus' }
export function ok<T>(value: T): Ok<T> {
  return { t: 'ok', value: value }
}

export type Options = {
  className?: string,
  style?: Object
}
