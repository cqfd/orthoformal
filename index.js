// @flow

import React from 'react'

export type Form<+T> = (Status<T> => void) => React$Element<*>

export type Status<+T> = Fresh | Bogus | Ok<T>
type Fresh = { t: 'fresh' }
type Bogus = { t: 'bogus' }
type Ok<+T> = { t: 'ok', value: T }

const fresh: Fresh = { t: 'fresh' }
const bogus: Bogus = { t: 'bogus' }
function ok<T>(value: T): Ok<T> {
  return { t: 'ok', value: value }
}

type Props<S> = {
  forms: $ObjMap<S, <T>(T) => Form<T>>,
  options?: {
    className?: string,
    style?: Object
  },
  report: Status<S> => void,
}
class Orthoform<Schema: { [string]: mixed }> extends React.Component<void, Props<Schema>, void> {
  states: $ObjMap<Schema, <T>(T) => Status<T>> = {}

  render() {
    const options = this.props.options
    return <div className={options && options.className} style={options && options.style}>{
      kvs(this.props.forms).map(([name, form]) => {
        const element = form(this.report(name))
        return React.cloneElement(element, { key: name })
      })
    }</div>
  }

  report = (name: string) => (status: mixed) => {
    this.states[name] = status

    let allFresh = true
    let unfinished = false
    const okValues: any = {}
    for (const name in this.props.forms) {
      const status = this.states[name]
      if (status === undefined) {
        unfinished = true
        return
      }
      switch ( status.t ) {
        case 'fresh':
          unfinished = true
          continue
        case 'bogus':
          this.props.report(bogus)
          return
        default:
          allFresh = false
          okValues[name] = status.value
      }
    }

    if (allFresh) this.props.report(fresh)
    else if (unfinished) this.props.report(bogus)
    else this.props.report(ok(okValues))
  }
}

export default function form<Forms: { [string]: Form<any> }>(forms: Forms, options?: Object): Form<$ObjMap<Forms, <T>(Form<T>) => T>> {
  return report => <Orthoform forms={forms} options={options} report={report} />
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

function kvs(map) {
  const result = []
  for (const k in map) {
    result.push([k, map[k]])
  }
  return result
}
