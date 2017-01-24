# Orthoformal: straighten out your forms :nerd_face:

Orthoformal is a compositional way to build forms with React. It uses Flow, so it's typesafe too!

An "orthoform" of type `Form<T>` represents a chunk of UI that will hopefully produce a value of type `T`. For example, a login form might have type `Form<{ email: string, password: string }>`.

Given a few orthoforms, say a `hasReadUserAgreement: Form<bool>` and a `credentials: Form<{ email: string, password: string }>`, you can compose them together:

```.jsx
// @flow

import { object, type Form } from './index.js'

type Credentials = { email: string, password: string }
const credentials: Form<Credentials> = ...

const hasReadUserAgreement: Form<bool> = ...

type SignUp = {
  credentials: Credentials,
  hasReadUserAgreement: bool,
}

const signup: Form<SignUp> = object({
  credentials: credentials,
  hasReadUserAgreement: hasReadUserAgreement,
})

```

## Other combinators

```.jsx
map<T, U>(form: Form<T>, f: T => U): Form<U>
optional<T>(form: Form<T>): Form<T | void>
maybe<T>(form: Form<T>): Form<?T>
```
