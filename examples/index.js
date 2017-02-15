// @flow

import React from 'react'
import ReactDOM from 'react-dom'

import TextInput from './text_input'
import Checkbox from './checkbox'

import * as orthoformal from '../index'
import { type Form, array, object, map, filter } from '../index'

const number = map(TextInput.form('age: '), parseInt)
const age = filter(number, n => !isNaN(n))

const form = object({
  name: TextInput.form('name: '),
  email: TextInput.form('email: '),
  age: age,
  hasReadTerms: filter(Checkbox.form("Have you read the terms?", false), checked => checked)
})

ReactDOM.render(
  object({
    firstLogin: form,
    secondLogin: form
  }).render(s => console.log(s)),
  document.getElementById('root'))
