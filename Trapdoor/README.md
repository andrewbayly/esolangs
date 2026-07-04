# Trapdoor

An esolang where the underlying language is JavaScript, and a program only
runs if its source — read as one enormous integer — is divisible by a
secret prime factor of a published semiprime.

```javascript
console.log("hello from inside the trapdoor");
/*8Kx...a 200-digit comment you had to solve for...f2*/
```

That comment isn't decoration. Without it (or one like it), the program
above is rejected outright — its source, as a number, just isn't a
multiple of the designer's secret `p`. With it, this exact program runs.

Full design rationale, the encoding spec, and — importantly — an honest
discussion of why a validator you can run is a validator you can read `p`
out of, live in **[SPEC.md](SPEC.md)**. This README is just the quick
start.

## Try it without installing anything

Open [`index.html`](index.html) in a browser. No build step, no server —
it's one static file. It has two modes:

- **Practice lock** — a tiny `N` you can factor yourself in the built-in
  workbench (trial division finds it in well under a second).
- **Production lock** — a real ~2048-bit semiprime, so you can watch the
  same factoring code you just wrote get nowhere, forever.

## Running the reference toolchain (Node, no dependencies)

```bash
node keygen.js 256        # designer: generates p, q, N
                           #   -> secret-keys.json (keep private)
                           #   -> public-N.txt      (publish)

node obfuscate.js         # designer: builds validator.js from secret-keys.json
                           #   -> validator.js       (publish)

node pad.js <p> in.js out.td   # anyone holding p: turns any JS file into
                                # valid Trapdoor source

node trapdoor.js out.td   # anyone: validates, then runs if valid
```

`keygen.js 256` generates 256-bit primes (a 512-bit `N`) by default —
plenty for trying the toolchain out; see [SPEC.md §8](SPEC.md#8-open-design-knobs)
for guidance on sizing `N` for an actual puzzle versus a real deployment.

## What's in this repo

| File | Purpose |
|---|---|
| `SPEC.md` | Full language spec, encoding, and design-tension discussion |
| `index.html` | Standalone, client-side, illustration of the player experience |
| `bigmath.js` | BigInt helpers: modpow, Miller–Rabin, random prime generation |
| `keygen.js` | Designer tool: generate `p`, `q`, `N` |
| `obfuscate.js` | Designer tool: build a publishable `validator.js` from `p` |
| `validator.js` | Example generated output — the divisibility check itself |
| `pad.js` | Given `p`, pad any JS file into valid Trapdoor source |
| `trapdoor.js` | CLI interpreter: validate, then execute |

## A word of caution before you build on this

The reference toolchain and `demo.html` are two separate implementations
of the same spec, not a shared codebase — they encode source bytes
slightly differently under the hood (raw file bytes vs. `TextEncoder`
output) and aren't interchangeable out of the box. If you want a program
solved in one to validate in the other, check the encoding matches first.

Also see SPEC.md before treating any of this as a template for an actual
secret-keeping system: the validator you can run is, by construction, one
you can read `p` out of. That's discussed in detail, not glossed over.

## License

* MIT
