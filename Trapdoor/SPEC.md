# Trapdoor

An esolang where the underlying language is JavaScript, and a program is
**valid** iff its source, read as a big-endian byte-integer, is divisible by
`p` — one secret prime factor of a published semiprime `N = p × q`.

## 1. Encoding

A Trapdoor source file is a sequence of raw bytes. Interpreted big-endian,
base 256, those bytes form a single non-negative integer `S`. There is no
separate "encoding step" — this is just how you'd naturally read a byte
string as a number, MSB first.

## 2. Validity

A source is a valid Trapdoor program iff `S mod p == 0`, where `p` is a
secret prime chosen by the designer. The designer publishes `N = p·q` and an
*obfuscated validator* — runnable code that checks the condition — but never
publishes `p` or `q` directly.

## 3. Execution model

```
run(file):
  bytes = raw bytes of file          # NOT decoded as UTF-8 — see §5
  if not isValid(bytes): reject
  source = bytes decoded as latin1   # lossless byte<->char, safe for exec
  execute source as JavaScript
```

Rejected programs simply don't run — no partial execution, no error message
that leaks anything about *why* (beyond "not divisible").

## 4. The central design tension (read this before you build on top of it)

A validator that can *test* `S mod p == 0` necessarily contains enough
information to *reconstruct* `p` — that's what "testing divisibility"
means. So:

- The intended hard path is: factor `N` to get `p`, then construct source.
- The actual easy path is: read/run the validator's reconstruction logic,
  get `p` directly, skip factoring entirely.

This repo's `obfuscate.js` does not pretend otherwise. It masks `p` (XOR
against a SHA-256 keystream derived from `N`, limb-split and shuffled) so
grepping the file for a giant constant doesn't work — but anyone who runs
`reconstructP()` gets `p` in one line. That's the intended joke of the
esolang: *the only trapdoor is the one under the player's feet.*

If you want `p` to be genuinely unrecoverable from anything the player
holds, the validator can't ship to players at all — it has to run as a
server-side oracle (submit source, get accept/reject, nothing else). The
outline's "submit to the designer for validation assistance" path is
exactly this: an oracle mode where the designer's server does the check and
never reveals `p`, only the yes/no (and maybe not even a source you supply,
depending on how much oracle-abuse you want to allow — a submit-only oracle
with no feedback but pass/fail is still leaky under repeated queries, since
each accept/reject bit narrows `p`'s residue; rate-limit or salt-per-session
if that matters to your game).

## 5. Why bytes, not UTF-8 text, for the validity check

Padding (§6) needs to place arbitrary byte values inside a comment. Not
every byte sequence is valid UTF-8, so decoding-then-re-encoding as UTF-8
can silently change bytes, which would make a program that was divisible by
`p` on disk no longer divisible by `p` after being loaded. The reference
implementation reads files as raw `Buffer`s for the validity check, and only
decodes (via `latin1`, which is a lossless 1:1 byte↔char-code mapping) at
the point of feeding a string to the JS engine to execute.

## 6. Constructing valid programs (`pad.js`)

Given `p`, take any JavaScript snippet and append a trailing block comment
`/* <payload> */` whose bytes are solved algebraically so the *whole file's*
integer is `≡ 0 (mod p)`. Since comments don't affect JS semantics, this
never changes what the program does — only whether Trapdoor accepts it.

Sketch: if `prefix` = snippet + `"\n/*"` and `suffix` = `"*/"`, and
`payload` is `k` free bytes in between, the file's value is

```
prefix·256^(k+2) + payload·256^2 + suffix
```

Solve for `payload ≡ target (mod p)` using the modular inverse of `256²`
mod `p` (exists since `p` is odd). Because `k` is chosen with a few bytes of
margin beyond `p`'s byte-length, there's room to try `payload + m·p` for
`m = 0, 1, 2, …` until the byte representation doesn't contain a stray
`*/` (which would close the comment early) or start with `/` (which would
close the *opening* `/*` early). This is a few dozen candidates at most in
practice.

## 7. Toolchain (reference implementation, plain Node + BigInt, no deps)

| File | Role | Who runs it |
|---|---|---|
| `bigmath.js` | modpow, Miller–Rabin, random prime gen | shared |
| `keygen.js` | generates `p, q, N` | designer only |
| `obfuscate.js` | builds `validator.js` from the secret `p` | designer only |
| `validator.js` | *generated*, published; `isValid(buffer)` | everyone |
| `trapdoor.js` | CLI interpreter: validate, then execute | everyone |
| `pad.js` | given `p`, turns any JS into valid Trapdoor source | anyone who has `p` |

```
node keygen.js 256              # -> secret-keys.json (private), public-N.txt (publish)
node obfuscate.js               # -> validator.js (publish)
node pad.js <p> in.js out.td    # requires knowing p
node trapdoor.js out.td         # validate + run
```

## 8. Open design knobs

- **Key size**: 256-bit primes (512-bit `N`) is already well past what
  anyone will factor by hand for a puzzle; drop to ~40 bits for a
  "beatable in an afternoon with a laptop" difficulty, or go larger for
  "essentially never, this is flavor not a real puzzle."
- **Multiple valid primes**: publish several semiprimes with different
  factors, each unlocking a different *dialect* (e.g. different allowed
  builtins) — turns Trapdoor into a set of unlockable tiers.
- **Partial credit / hints**: an oracle mode could return `gcd(S, N)` (which
  is `p`, `q`, `1`, or `N`) instead of a plain accept/reject — that's a much
  bigger hint than intended, so probably don't, but worth naming explicitly
  as a foot-gun since `gcd(S, N)` is a one-liner if `S` happens to already
  share a factor with `N`.
- **Negative space rule**: consider explicitly disallowing programs that
  are *coincidentally* valid (e.g. searching random source until one hits
  `≡ 0 mod p` without knowing `p`) — with `p` a 256-bit prime this is
  astronomically unlikely to matter in practice, so probably not worth a
  rule, just noting the theoretical edge.
