# jiff-lite

ref. [jiff-react](https://github.com/abhinavmir/jiff-react)

Point is to port the current Jiff lib such that we can use it in React/Vue etc. The first thing we'll do is port `sum`, which uses `share`, `sadd`, `open` as the base functions. Next will be `median`. Current `jiff` sample of `median` can be found in `jiff` branch [`median-demo`](https://github.com/multiparty/jiff/tree/median_demo). I am not developing in the jiff-lite repo of `multiparty` since a lot of work is still TBD, and I do not want to make assumptions about libraries from the beginning. Often times, harmless libs pollute the `dist` with `node`-first libs.

`share`: [`client/api/sharing.js, line 39`]()
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

[`jiffClient.share`](https://github.com/abhinavmir/jiff/blob/2d61b98d7c3c408cc59cfb486b56ab269a20ab1b/lib/client/api/sharing.js#L39) - needs `internal_share` (the checks `share` performs are important but mostly use `typeof()` and checks if `secret` is greater than `zp`). `share` is Alice's input that Bob shouldn't know, Bob should only know Bob's input and the sum of Alice and Bob's input. Of course, this is trivial since he can subtract and reach Alice's input, but this is just an example. If Alice, Bob, and Rajesh are computing a total, you can see how probability of finding individual inputs decreases. Default value for recievers_list is `all_parties`, because we do not want to exclude any parties by default. We also try to find a `zp` for the parties' instance, tag the message and send. 

`internal_share` is bound to `jiff_share` via `jiffClient.internal_share = shareProtocol.jiff_share.bind(null, jiffClient);`. Let's quickly look at that.

[jiff_share](https://github.com/abhinavmir/jiff/blob/2d61b98d7c3c408cc59cfb486b56ab269a20ab1b/lib/client/protocols/shamir/share.js#L72) can be found in `client/protocols/shamir/share.js`. This is how it works.

1. **Initialization**: 
   - Validates and sets default values for parameters like `threshold`, `receivers_list`, `senders_list`, and `Zp`.
   - Generates a unique `share_id` if not provided.

2. **Role Determination**:
   - Determines whether the current party is a sender, a receiver, or both. If it's neither, the function exits early with an empty result.

3. **Share Computation for Senders**:
   - If the party is a sender, it computes shares of the secret for each receiver.
   - This computation involves generating a random polynomial with the secret as the constant term, and the degree is one less than the threshold.
   - Evaluates this polynomial at values corresponding to each receiver's ID to obtain their share.

4. **Encryption and Transmission**:
   - Each computed share is encrypted and signed to ensure confidentiality and authenticity.
   - The shares are then sent to their respective receivers over a secure channel.

5. **Receiving and Wrapping Shares**:
   - If the party is a receiver, it sets up a promise for each share it expects to receive.
   - As shares arrive (possibly out of order), the promises are resolved.
   - Each received share is wrapped in a `SecretShare` object, which encapsulates the share and provides methods for further MPC operations.

6. **Result Compilation**:
   - The function compiles a map where each key is a sender's ID, and the corresponding value is the `SecretShare` object received from that sender.
   - If the party is not a receiver, this map will be empty.

7. **Return**:
   - Returns the map of `SecretShare` objects. This allows the receiving parties to use these shares for subsequent MPC operations like addition, multiplication, etc.

### Example 

#### Parties
- Party 1: Shares secret $s_1 = 1$
- Party 2: Shares secret $s_2 = 2$

#### Threshold
- Threshold $t = 2$

#### Polynomial Generation
- Party 1's polynomial: $f_1(x) = 1 + a_1 \cdot x$ (where $a_1$ is a random coefficient).
- Party 2's polynomial: $f_2(x) = 2 + a_2 \cdot x$ (where $a_2$ is another random coefficient).

#### Share Computation
- Party 1 computes:
  - $\text{share}_{1,1} = f_1(1) = 1 + a_1 \cdot 1$
  - $\text{share}_{1,2} = f_1(2) = 1 + a_1 \cdot 2$
- Party 2 computes:
  - $\text{share}_{2,1} = f_2(1) = 2 + a_2 \cdot 1$
  - $\text{share}_{2,2} = f_2(2) = 2 + a_2 \cdot 2$

#### Share Distribution
- Party 1 sends $\text{share}_{1,2}$ to Party 2 and keeps $\text{share}_{1,1}$.
- Party 2 sends $\text{share}_{2,1}$ to Party 1 and keeps $\text{share}_{2,2}$.

#### Example Values (Assuming $a_1 = 3$ and $a_2 = 4$):
- Party 1's polynomial: $f_1(x) = 1 + 3x$.
- Party 2's polynomial: $f_2(x) = 2 + 4x$.
- Party 1 computes:
  - $\text{share}_{1,1} = 4 \mod 17$
  - $\text{share}_{1,2} = 7 \mod 17$
- Party 2 computes:
  - $\text{share}_{2,1} = 6 \mod 17$
  - $\text{share}_{2,2} = 10 \mod 17$


[UML](https://lucid.app/lucidchart/99958fb2-8a39-40cd-9797-5e5327f274ee/edit?viewport_loc=-2447%2C-1626%2C4894%2C2473%2CHWEp-vi-RSFO&invitationId=inv_7d9db5e2-3ebd-44dd-804b-ef3ade981056) of current Jiff layout (wip)
