# jiff-lite

ref. [jiff-react](https://github.com/abhinavmir/jiff-react)

Point is to port the current Jiff lib such that we can use it in React/Vue etc. The first thing we'll do is port `sum`, which uses `share`, `sadd`, `open` as the base functions. Next will be `median`. Current `jiff` sample of `median` can be found in `jiff` branch [`median-demo`](https://github.com/multiparty/jiff/tree/median_demo). I am not developing in the jiff-lite repo of `multiparty` since a lot of work is still TBD, and I do not want to make assumptions about libraries from the beginning. Often times, harmless libs pollute the `dist` with `node`-first libs.

`share`: `client/api/sharing.js, line 7`
`open`: `client/api/sharing.js, line 80`
`sadd`: `client/protocols/numbers/arithmetic.js`