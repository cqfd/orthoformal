// @flow

import React from 'react'

export type Form<T> = (?T => void) => React$Element<any>

type Props<S> = {
  forms: $ObjMap<S, <T>(T) => Form<T>>,
  options?: Object,
  report: ?S => void,
}
class Orthoform<Schema: { [string]: any }> extends React.Component<void, Props<Schema>, void> {
  states: $ObjMap<Schema, <T>(T) => ?T> = {}

  render() {
    const options = this.props.options
    return <div className={options && options.className} style={options && options.style}>{
      kvs(this.props.forms).map(([name, form]) => {
        const element = form(this.report(name))
        return React.cloneElement(element, { key: name })
      })
    }</div>
  }

  report = (name: string) => (state: any) => {
    this.states[name] = state

    let allUndefined = true
    let anyUndefined = false
    let anyNull = false
    const okStates: any = {}
    for (const name in this.props.forms) {
      const state = this.states[name]
      if (state === undefined) {
        anyUndefined = true
        continue
      } else if (state === null) {
        allUndefined = false
        anyNull = true
      } else {
        allUndefined = false
        okStates[name] = state
      }
    }

    if (anyNull) {
      this.props.report(null)
    } else if (allUndefined) {
      this.props.report(undefined)
    } else if (anyUndefined) {
      this.props.report(null)
    } else {
      this.props.report(okStates)
    }
  }
}

export default function form<Forms: { [string]: Form<any> }>(forms: Forms, options?: Object): Form<$ObjMap<Forms, <T>(Form<T>) => T>> {
  return report => <Orthoform forms={forms} options={options} report={report} />
}

export function map<A, B>(form: Form<A>, f: A => B): Form<B> {
  return report => form(a => (a == null) ? report(a) : report(f(a)))
}

export function optional<A>(form: Form<A>): Form<{ value: A | void }> {
  return report => form(a => a === null ? report(a) : report({ value: a }))
}

function kvs(map) {
  const result = []
  for (const k in map) {
    result.push([k, map[k]])
  }
  return result
}
