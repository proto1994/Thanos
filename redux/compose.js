export default function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg
  if (funcs.length === 1) return funcs[0]
  return funcs.reduce((prev, cur) => {
    return (...args) => prev(cur(...args))
  })
}

// const a = (c) => {
//   console.log(c, 'a')
//   return c + 1
// }
// const b = (c) => {
//   console.log(c, 'b')
//   return c + 1
// }
// const c = (c) => {
//   console.log(c, 'c')
//   return c + 1
// }

// compose(a, b, c)(2)

// prev = a
// cur = b

// prev = (...args) => a(b(...args))
// cur = c

// prev = (..args) => a(b())


// 2 c
// 3 b
// 4 a