// @flow

import React from 'react'
import * as status from './status'
import { type Status } from './status'

export type Form<+T> = {
  +initialStatus: Status<T>,
  render(report: Status<T> => void): React$Element<any>
}

export function pure<A>(value: A): Form<A> {
  return {
    initialStatus: status.pure(value),
    render: report => React.createElement(() => null)
  }
}

export function map<A, B>(form: Form<A>, f: A => B): Form<B> {
  return {
    initialStatus: status.map(form.initialStatus, f),
    render: report => form.render(s => report(status.map(s, f)))
  }
}

export function filter<A>(form: Form<A>, predicate: A => bool): Form<A> {
  return {
    initialStatus: status.filter(form.initialStatus, predicate),
    render: report => form.render(s => report(status.filter(s, predicate)))
  }
}

export function optional<A>(form: Form<A>): Form<A | void> {
  return {
    initialStatus: status.optional(form.initialStatus),
    render: report => form.render(s => report(status.optional(s)))
  }
}

export function maybe<A>(form: Form<A>): Form<?A> {
  return {
    initialStatus: status.maybe(form.initialStatus),
    render: report => form.render(s => report(status.maybe(s)))
  }
}

export function array<Forms: Array<Form<any>>>(forms: Forms): Form<$TupleMap<Forms, <T>(Form<T>) => T>> {
  return {
    initialStatus: status.array(forms.map(f => f.initialStatus)),
    render: report => <Ortharray forms={forms} report={report} />
  }
}

export function object<Forms: { [name: string]: Form<any> }>(forms: Forms): Form<$ObjMap<Forms, <T>(Form<T>) => T>> {
  return {
    initialStatus: status.object(objectMap(forms, f => f.initialStatus)),
    render: report => <Orthobject forms={forms} report={report} />
  }
}

type ArrayProps<S> = {
  forms: $TupleMap<S, <T>(T) => Form<T>>,
  report: Status<S> => void
}

class Ortharray<S: Array<any>> extends React.Component<void, ArrayProps<S>, void> {
  statuses: $TupleMap<S, <T>(T) => Status<T>>
  constructor(props: ArrayProps<S>) {
    super(props)
    this.statuses = props.forms.map(f => f.initialStatus)
  }
  render() {
    return <div>{
      this.props.forms.map((form, idx) =>
        React.cloneElement(form.render(this.report(idx)), { key: idx }))
    }</div>
  }
  report = (idx: number) => (s: Status<any>) => {
    this.statuses[idx] = s
    this.props.report(status.array(this.statuses))
  }
  componentWillReceiveProps(props) {
    this.statuses = props.forms.map(f => f.initialStatus)
  }
}

type ObjectProps<S> = {
  forms: $ObjMap<S, <T>(T) => Form<T>>,
  report: Status<S> => void
}

class Orthobject<S: { [name: string]: any }> extends React.Component<void, ObjectProps<S>, void> {
  statuses: $ObjMap<S, <T>(T) => Status<T>>
  constructor(props: ObjectProps<S>) {
    super(props)
    this.statuses = objectMap(props.forms, f => f.initialStatus)
  }
  render() {
    return <div>{
      kvs(this.props.forms).map(([name, form]) =>
        React.cloneElement(form.render(this.report(name)), { key: name }))
    }</div>
  }
  report = (name: string) => (s: Status<any>) => {
    this.statuses[name] = s
    this.props.report(status.object(this.statuses))
  }
  componentWillReceiveProps(props) {
    this.statuses = objectMap(props.forms, f => f.initialStatus)
  }
}

function kvs(map) {
  const result = []
  for (const k in map) {
    result.push([k, map[k]])
  }
  return result
}

function objectMap(obj, f): any {
  const result = {}
  for (const key in obj) {
    result[key] = f(obj[key])
  }
  return result
}
