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


## Open
ref. [`jiff_open`](https://github.com/abhinavmir/jiff/blob/e062e840611e58bf98605da352d1ae69c115c080/lib/client/protocols/shamir/open.js#L40)

When called, `jiff_open` first checks if the `share` belongs to the given JIFF instance. It then determines the parties involved in opening the share. If no parties are specified, it defaults to all parties in the computation.

It assigns an operation ID (`op_id`) for tracking and consistency. If the calling party holds a part of the secret (`share.holders` includes the party's ID), the function refreshes the share to keep the original secret secure.

Next, `jiff_open` broadcasts the refreshed share to all specified parties using `jiff_broadcast`. If the calling party is a receiver (listed in `parties`), it prepares to reconstruct the secret. It waits until enough shares (as per the threshold) are received.

Once enough shares are received, the function reconstructs the secret using Lagrange interpolation in `jiff_lagrange`. This involves calculating Lagrange coefficients for each share and combining them to find the secret.

The promise resolves with the reconstructed secret, allowing parties to access it. If the calling party is neither a holder nor a receiver, the function returns null, indicating no action is required from that party.


# sadd

`sadd` is a method for securely adding two secret shares. It performs addition while preserving the confidentiality of the individual shares. 

When `sadd` is invoked with a secret share `o`:

1. It first checks if `o` belongs to the same JIFF instance and has the same modulus field (`Zp`). It also checks if both shares are held by the same parties.

2. The method prepares a function, `ready`, that defines how to add the values of the two shares. This is done using the share helpers and modulo arithmetic to ensure results stay within the field `Zp`.

3. The `sadd` method then creates a new `SecretShare` object. This object represents the sum of the two shares. The creation of this new share is deferred until both original shares are ready to be operated on.

4. The method returns this new `SecretShare` object. This share will become the sum of the two inputs once both are ready.

The `sadd` method allows the parties holding the shares to compute the sum without revealing their individual share values. The computation is performed locally by each party.


# How it all comes together

### Sharing Secrets (`share`)
- **Process**: The `share` function is used to distribute a secret among parties. A secret (input) is divided into shares, one for each party, using Shamir's Secret Sharing scheme.
- **Key Steps**:
  1. Generate a random polynomial with the secret as the constant term and a degree one less than the threshold.
  2. Compute shares of the secret for each party by evaluating the polynomial at values corresponding to each party's ID.
  3. Encrypt and send each share to its respective party.

### Secure Addition (`sadd`)
- **Purpose**: `sadd` enables the secure addition of two secret shares, producing a new secret share representing their sum.
- **Key Steps**:
  1. Check if the shares belong to the same JIFF instance and field (`Zp`).
  2. Define a function (`ready`) to add the values of the two shares, using modular arithmetic.
  3. Create a new `SecretShare` object to represent the sum.
  4. Return this new share, which gets resolved once both original shares are ready.

### Opening Shares (`open`)
- **Functionality**: `open` reveals the value of a shared secret to specified parties.
- **Key Steps**:
  1. Check if the share belongs to the JIFF instance and identify the involved parties.
  2. If the calling party holds a part of the secret, refresh the share to maintain secrecy.
  3. Broadcast the refreshed share to specified parties using `jiff_broadcast`.
  4. Reconstruct the secret using Lagrange interpolation when enough shares are received.

### Bringing It All Together
In an MPC computation, such as computing the sum of inputs from multiple parties:

1. **Initialization**: Each party connects to a server, initializing their JIFF instance.
2. **Sharing Inputs**: Each party uses `share` to distribute their input among all parties.
3. **Computing Sum**: Parties use `sadd` to securely add up their shares. This is done locally without revealing individual inputs.
4. **Revealing Result**: The sum (a secret share) is opened to all or specified parties using `open`, revealing the final computation result.


Now, to reconstruct this in TypeScript, such that it works in React or Vue - we can start at the bottom.

The first thing we can build is the `mailbox` - which I haven't talked about yet. `mailbox` is used for communication between multiple parties. This is done via `socket.io-client`, which is great because it allows for the code to run in browser. 

```javascript
var io = require('socket.io-client');

function guardedSocket(jiffClient) {
  jiffClient.options.socketOptions = Object.assign({}, defaultSocketOptions, jiffClient.options.socketOptions);

  // Create plain socket io object which we will wrap in this
  var socket = io(jiffClient.hostname, jiffClient.options.socketOptions);
  socket.old_disconnect = socket.disconnect;
  socket.mailbox = linked_list(); // for outgoing messages
  socket.empty_deferred = null; // gets resolved whenever the mailbox is empty
  socket.jiffClient = jiffClient;

  // add functionality to socket
  socket.safe_emit = safe_emit.bind(socket);
  socket.resend_mailbox = resend_mailbox.bind(socket);
  socket.disconnect = disconnect.bind(socket);
  socket.safe_disconnect = safe_disconnect.bind(socket);
  socket.is_empty = is_empty.bind(socket);

  return socket;
}
```

[Here](https://github.com/abhinavmir/jiff/blob/e062e840611e58bf98605da352d1ae69c115c080/lib/client/socket/mailbox.js#L24) you can see that we are "duck patching" existing socket object with more members.

We set the socket's default disconnect to `old_disconnect`, add in a mailbox, which is a linked list, set a `jiffClient` to it, etc. etc.

This is the first functionality I want to get working. 

