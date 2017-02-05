// @flow

import invariant from 'assert'

export type Status<+T> = Fresh | Bogus | Emptied | Ok<T>
type Fresh = {| t: 'fresh' |}
type Bogus = {| t: 'bogus' |}
type Emptied = {| t: 'emptied' |}
type Ok<+T> = {| t: 'ok', +value: T |}

export const fresh: Fresh = { t: 'fresh' }
export const bogus: Bogus = { t: 'bogus' }
export const emptied: Emptied = { t: 'emptied' }
export function pure<T>(value: T): Ok<T> {
  return { t: 'ok', value: value }
}

export function map<A, B>(status: Status<A>, f: A => B): Status<B> {
  switch (status.t) {
    case 'fresh': case 'emptied': case 'bogus': return status
    default: return pure(f(status.value))
  }
}

export function filter<A>(status: Status<A>, predicate: A => bool): Status<A> {
  switch (status.t) {
    case 'fresh': case 'emptied': case 'bogus': return status
    default: return predicate(status.value) ? status : bogus
  }
}

export function optional<A>(status: Status<A>): Status<A | void> {
  switch (status.t) {
    case 'fresh': case 'emptied': return pure(undefined)
    case 'bogus': return bogus
    default: return pure(status.value)
  }
}

export function maybe<A>(status: Status<A>): Status<?A> {
  switch (status.t) {
    case 'fresh': case 'emptied': return pure(undefined)
    case 'bogus': return pure(null)
    default: return pure(status.value)
  }
}

export function flatMap<A, B>(status: Status<A>, f: A => Status<B>): Status<B> {
  switch (status.t) {
    case 'fresh': case 'emptied': case 'bogus': return status
    default: return f(status.value)
  }
}

export function both<A, B>(left: Status<A>, right: Status<B>): Status<[A, B]> {
  switch (left.t) {
    case 'fresh':
      switch (right.t) {
        case 'fresh': case 'emptied': case 'bogus': return right
        default: return bogus
      }
    case 'emptied':
      switch (right.t) {
        case 'fresh': case 'emptied': return emptied
        default: return bogus
      }
    case 'bogus': return bogus
    default:
      switch (right.t) {
        case 'fresh': case 'emptied': case 'bogus': return bogus
        default: return pure([left.value, right.value])
      }
  }
}

export function array<Statuses: Array<Status<any>>>(statuses: Statuses): Status<$TupleMap<Statuses, <T>(Status<T>) => T>> {
  if (statuses.length === 0) return pure([])
  else if (statuses.length === 1) return map(statuses[0], ok => [ok])
  else {
    const [first, ...rest] = statuses
    return map(both(first, array(rest)), ([ok, oks]) => [ok, ...oks])
  }
}

export function object<Statuses: { [string]: Status<any> }>(statuses: Statuses): Status<$ObjMap<Statuses, <T>(Status<T>) => T>> {
  let result = null
  for (const name in statuses) {
    const status = statuses[name]
    if (result === null) {
      result = map(status, ok => ({ [name]: ok }))
    } else {
      result = map(both(result, status), ([oks, ok]) => ({ ...oks, [name]: ok }))
    }
  }
  return result || pure({})
}
