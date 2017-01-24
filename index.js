// @flow

import React from 'react'

import { type Form, type Status, fresh, bogus, ok } from './types'
export type { Form, Status }

import Orthobject from './object'
import Ortharray from './array'

export function object<Forms: { [string]: Form<mixed> }>(forms: Forms, options?: Object): Form<$ObjMap<Forms, <T>(Form<T>) => T>> {
  return report => <Orthobject forms={forms} options={options} report={report} />
}

export function array<Forms: Array<Form<mixed>>>(forms: Forms, options?: Object): Form<$TupleMap<Forms, <T>(Form<T>) => T>> {
  return report => <Ortharray forms={forms} options={options} report={report} />
}

export function map<A, B>(form: Form<A>, f: A => B): Form<B> {
  return report => form(status => {
    switch (status.t) {
      case 'fresh': report(fresh); return
      case 'bogus': report(bogus); return
      default: report(ok(f(status.value))); return
    }
  })
}

export function optional<A>(form: Form<A>): Form<A | void> {
  return report => form(status => {
    switch (status.t) {
      case 'fresh': report(ok(undefined)); return
      case 'bogus': report(bogus); return
      default: report(ok(status.value)); return
    }
  })
}

export function maybe<A>(form: Form<A>): Form<?A> {
  return report => form(status => {
    switch (status.t) {
      case 'fresh': report(ok(undefined)); return
      case 'bogus': report(ok(null)); return
      default: report(ok(status.value)); return
    }
  })
}
