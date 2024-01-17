# jiff-lite

ref. [jiff-react](https://github.com/abhinavmir/jiff-react)

Point is to port the current Jiff lib such that we can use it in React/Vue etc. The first thing we'll do is port `sum`, which uses `share`, `sadd`, `open` as the base functions. Next will be `median`. Current `jiff` sample of `median` can be found in `jiff` branch [`median-demo`](https://github.com/multiparty/jiff/tree/median_demo). I am not developing in the jiff-lite repo of `multiparty` since a lot of work is still TBD, and I do not want to make assumptions about libraries from the beginning. Often times, harmless libs pollute the `dist` with `node`-first libs.

`share`: [`client/api/sharing.js, line 39`](https://github.com/abhinavmir/jiff/blob/2d61b98d7c3c408cc59cfb486b56ab269a20ab1b/lib/client/api/sharing.js#L38)
`open`: `client/api/sharing.js, line 80`
`sadd`: `client/protocols/numbers/arithmetic.js`

`sadd` in turn requires - 

1. `this.jiff.helpers.mod`: Performs modular arithmetic.
2. `this.jiff.share_helpers['+']`: Adds values of two shares.
3. `this.when_both_ready`: Synchronizes operations until both shares are ready.
4. `this.jiff.SecretShare`: Constructs a new `SecretShare` object.

`We need `SecretShare` for a few things. First: `sadd` is a method in `SecretShare.prototype` - we can talk about if we need this, but we will keep this structure. `sadd` also needs to return a `SecretShare`.

We return a `SecretShare` instance in `sadd` to encapsulate the result of the addition operation in a share object. This allows for consistent handling of shared values and enables further operations to be performed on the result using the methods and properties provided by the `SecretShare` class. This approach maintains the secrecy and integrity of the data while facilitating the continuation of secure computations.

`SecretShare` should also have the following members (data/method - TBD).

1. `value`: The value of the secret share.
2. `holders`: Array of parties holding the share.
3. `threshold`: Minimum number of parties needed to reconstruct the secret.
4. `Zp`: The prime number defining the field for modular arithmetic.
5. `jiff`: Instance of the JIFF client containing necessary methods and properties.


`Zp` refers to a prime number used in modular arithmetic operations within JIFF. In such a context, all arithmetic operations (addition, subtraction, multiplication, etc.) are performed modulo `Zp`. This ensures that the results of computations stay within a finite field of size `p`, which is crucial for maintaining the mathematical properties needed for secure computation and cryptographic protocols.