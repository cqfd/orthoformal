// @flow

import React from 'react'
import { pure, fresh, emptied } from '../status'
import { type Form } from '../index'

type Props = {
  label: string,
  input(input?: string): void
}
type State = { value?: string }

export default class TextInput extends React.PureComponent {
  props: Props
  state: State = { value: undefined }

  render() {
    return <label>
      <span>{this.props.label}</span>
      <input type='text' value={this.state.value || ''} onChange={this.onChange} />
    </label>
  }

  onChange = (evt: any) => {
    const value = evt.target.value
    this.setState({ value: evt.target.value }, _ => this.input(value))
  }

  input = this.props.input

  static form(label: string): Form<string> {
    return {
      initialStatus: fresh,
      render: report => <TextInput label={label} input={s => {
        if (s === undefined) {
          report(fresh)
        } else if (s === '') {
          report(emptied)
        } else {
          report(pure(s))
        }
      }} />
    }
  }
}
