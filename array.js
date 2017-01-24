// @flow

import React from 'react'

import { type Form, type Status, type Options, fresh, bogus, ok } from './types'

type Props<S> = {
  forms: $TupleMap<S, <T>(T) => Form<T>>,
  options?: Options,
  report: Status<S> => void,
}

export default class Ortharray<Schema: Array<mixed>> extends React.Component<void, Props<Schema>, void> {
  states: $TupleMap<Schema, <T>(T) => Status<T>> = []

  render() {
    const options = this.props.options
    return <ul className={options && options.className} style={options && options.style}>{
      this.props.forms.map((form, idx) => {
        const element = form(this.report(idx))
        return <li key={idx}>{element}</li>
      })
    }</ul>
  }

  report = (idx: number) => (status: mixed) => {
    this.states[idx] = status

    let allFresh = true
    let unfinished = false
    const okValues: any = {}
    for (let idx = 0; idx < this.props.forms.length; idx++) {
      const status = this.states[idx]
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
          okValues[idx] = status.value
      }
    }

    if (allFresh) this.props.report(fresh)
    else if (unfinished) this.props.report(bogus)
    else this.props.report(ok(okValues))
  }
}
