// @flow

import React from 'react'

import { pure } from '../status'
import { type Form } from '../index'

type Props = {
  label: string,
  initiallyChecked: bool,
  checked(checked: bool): void,
}
type State = { checked: bool }

export default class Checkbox extends React.PureComponent {
  props: Props
  state: State
  constructor(props: Props) {
    super(props)
    this.state = { checked: props.initiallyChecked }
  }
  render() {
    return <label>
      {this.props.label}
      <input type="checkbox" checked={this.state.checked} onChange={evt => {
        this.setState({ checked: evt.target.checked })
        this.props.checked(evt.target.checked)
      }} />
    </label>
  }
  static form(label: string, initiallyChecked?: bool): Form<bool> {
    return {
      initialStatus: pure(!!initiallyChecked),
      render: report => <Checkbox label={label} initiallyChecked={!!initiallyChecked} checked={checked => report(pure(checked))} />
    }
  }
}
