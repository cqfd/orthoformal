import assert from 'assert'

import { both, array, object, pure, fresh, bogus, emptied } from './status'

describe('Status<T>', () => {

  it('works with arrays', () => {
    assert.deepEqual(array([pure(123)]), pure([123]))
    assert.deepEqual(array([pure(123), pure('foo')]), pure([123, 'foo']))
    assert.deepEqual(array([fresh, pure(123), pure('foo'), bogus]), bogus)
    assert.deepEqual(array([bogus]), bogus)
    assert.deepEqual(array([fresh, fresh, fresh, fresh]), fresh)
  })
  it('works with objects', () => {
    assert.deepEqual(object({ x: pure(123) }), pure({ x: 123 }))
    assert.deepEqual(object({
      x: pure(123),
      y: pure('foo')
    }), pure({
      x: 123,
      y: 'foo'
    }))
    assert.deepEqual(object({
      x: pure(123),
      y: pure('foo'),
      z: bogus
    }), bogus)
    assert.deepEqual(object({
    }), pure({}))
    assert.deepEqual(object({
      x: pure(123),
      y: pure(99),
      z: fresh
    }), bogus)
    assert.deepEqual(object({
      x: fresh,
      y: fresh,
      z: fresh
    }), fresh)
    assert.deepEqual(object({
      x: fresh,
      y: fresh,
      z: emptied
    }), emptied)
    assert.deepEqual(object({
      x: fresh,
      y: fresh,
      z: emptied,
      w: bogus
    }), bogus)

    assert.deepEqual(array([
      object({
        x: pure(123),
        y: pure('foo')
      })
    ]), pure([{ x: 123, y: 'foo' }]))
  })


})
