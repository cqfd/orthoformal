// @flow

import React from 'react'
import ReactDOM from 'react-dom'

import TextInput from './text_input'

import * as orthoformal from '../index'
import { type Form } from '../index'

const example = TextInput.form('example: ')
const number = orthoformal.map(example, parseInt)
const age: Form<number> = orthoformal.filter(number, n => !isNaN(n))

const form: Form<{ name: string, age: number, interests: [string, string] }> = orthoformal.object({
  name: TextInput.form('name: '),
  age: age,
  interests: orthoformal.array([TextInput.form('interest: '), TextInput.form('interest: ')])
})

ReactDOM.render(
  form.render(s => console.log(s)),
  document.getElementById('root'))

function repeat<T>(n: number, t: T): Array<T> {
  return Array(n).fill(t)
}
