# Learning log

A blank notebook for your GSAP study sessions. The course gives you the pages. You
write on them.

This file is part of the starter kit. Keep your own notes in it on your own branch, so
`main` stays clean for the next learner.

## How to use it

```sh
git switch -c my-study
# study, type code, fill in this log
git add docs/learning-log.md
git commit -m "Study: lesson 01 first tween"
```

Then merge `main` into your branch whenever the course itself gets better.

## The study loop

1. Read one small task with an expected result.
2. Type the code by hand. No copy and paste.
3. Run `pnpm run check` and look at the browser together.
4. Explain the code back in your own words.
5. Write the session in this log and commit.

## Copy this for each session

```md
## Session N — YYYY-MM-DD

**Lesson:**
**Goal:**

Typed:

-

What clicked:

-

Still shaky:

-

Next action:

-
```

## Current position

- **Lesson:** none yet
- **Next action:** open `/sandbox` and type a first tween
- **Sessions logged:** 0

## Sessions

Nothing here yet. Copy the template above and start with session 1.

## Words to keep

| Word     | Plain meaning                                            |
| -------- | -------------------------------------------------------- |
| tween    | One animation, start to finish.                          |
| target   | The element or object that changes.                      |
| vars     | The values you animate, like `x`, `rotation`, `opacity`. |
| duration | How long the tween runs, in seconds.                     |
| ease     | How the speed changes during the tween.                  |
| revert   | Undo what GSAP changed, so the page returns to normal.   |

Add new words as you meet them. Keep the meaning short.

## Branch rules

- `main` is the coloring book: the course, the sandbox, and this log template.
- Your study branch is the coloring: your code and your log entries.
- Fixes to the course belong on `main`, so every learner gets them.
- Commit small and often. Any mistake is one `git reset` away.
