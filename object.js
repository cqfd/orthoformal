// @flow

import React from 'react'

import { type Form, type Status, type Options, fresh, bogus, ok } from './types'

type Props<S> = {
  forms: $ObjMap<S, <T>(T) => Form<T>>,
  options?: Options,
  report: Status<S> => void,
}

export default class Orthobject<Schema: { [string]: mixed }> extends React.Component<void, Props<Schema>, void> {
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

function kvs(map) {
  const result = []
  for (const k in map) {
    result.push([k, map[k]])
  }
  return result
}
