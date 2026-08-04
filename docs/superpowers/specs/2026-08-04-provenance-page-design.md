# Design: the provenance page and sitewide AI disclosure

**Date:** 2026-08-04
**Repo:** `~/Developer/goldie-boone` (Vada's site is referenced but NOT changed)
**Status:** approved by Tolga, ready for an implementation plan

## Problem

`/how-these-songs-are-made` is linked from two places on the live site and
returns 404.

- `components/site-footer.tsx:152` renders it in the footer.
- `components/front-cover.tsx:184` renders it in the hero link set.
- `content/types.ts:46` documents the field as existing for EU AI Act Art. 50.
- `components/site-footer.tsx:44-58` carries a long comment explaining that the
  link is a legal disclosure and must never be quietened, greyed, shrunk, or
  moved below the fold, enforced by sharing one className with "Press".

So the site has an enforcement mechanism protecting a link to a page that was
never built. A broken disclosure link is worse than no link: an absent link is
an omission, a dead one documents that disclosure was known to be required.

This became urgent because Instagram removed the after-publish AI-label toggle
and Blotato does not forward Meta's `is_ai_generated` (verified 2026-08-03: the
field is accepted and stored on an `instagram` target but not applied on the
published reel). Instagram is therefore uncovered at the post level, which
raises the value of every disclosure surface that IS controlled.

## Decisions

Each of these was decided with Tolga during brainstorming on 2026-08-04.

| Question | Decision |
|---|---|
| Build the page, or delete the links? | **Build the page.** The goal is a disclosure that carries feeling, and one footer line cannot do that. |
| Page only, or page plus sitewide line? | **Both.** The footer line does the legal work on every page; the page is then free to lead with craft. |
| Whose voice? | **Goldie's first person**, matching Vada's existing pattern. |
| Order? | **Craft first, character fact second**, but the page stays short enough that the fact is never below the fold. |
| Name the collaborators? | **No.** Keep it mysterious about the people. Convey thought and effort, not headcount or identities. |
| Mention gender? | **No**, in either direction. The disclosure is about character versus person. |
| Differentiate from Vada? | **Yes, required.** Different register, no shared sentences. |

### The guardrail that governs the copy

**Mystery applies to the humans, never to the AI.** Being private about who
makes this and how is Tolga's to keep. Being vague about whether Goldie is
generated is the one thing this page cannot do, because that is its legal
purpose.

**Do NOT write "nothing is automated".** It is false and falsifiable: Blotato
publishes ~35 scheduled posts a week on a timer, Cowork drafts the briefs,
captions are built from AI-generated seeds, and the reply engine drafts fan
replies twice daily. On a page whose job is truthfulness about AI, one
checkable overclaim discredits the true statements beside it.

The true and stronger claim is **no abdication, not no automation**: nothing
ships that a person did not choose. That is accurate and survives scrutiny.

### What is factually true and may be claimed

- Lyric hooks, opening lines, and core ideas originate with a human writer.
  The AI generates the rest of the lyric and the melody around them.
- The voice and the instrumentation are AI-generated.
- Goldie's face and likeness are AI-generated. She is a character.
- Many outputs are rejected before one is accepted. The selection is human.
- More than one person shapes the writing (not to be detailed on the page).

## Architecture

| File | Change |
|---|---|
| `content/types.ts` | add `aiDisclosureShort: string` to the artist type, with a comment mirroring Vada's Art. 50 note |
| `content/artist.ts` | add the `aiDisclosureShort` value. `provenanceHref` and `provenanceLabel` stay unchanged |
| `components/site-footer.tsx` | render `aiDisclosureShort` above the existing link row. Do not touch `MORE_LINK_CLASS`, `MORE_LINK_TYPE`, or the link row itself |
| `app/how-these-songs-are-made/page.tsx` | **new route**, the page |
| `components/front-cover.tsx` | **untouched.** Its link begins working the moment the route exists |

No existing link is removed. The footer enforcement machinery is preserved
exactly; it simply gains a destination.

The site is otherwise a deliberate one-page "sleeve". This is the only second
route, justified because the disclosure needs more room than one screen of the
sleeve allows.

## Copy

### Footer line (every page)

> Goldie is a country project brought to life with AI. The writing starts with people.

Vada's equivalent stays as it is and is NOT edited:

> Some of what you hear and see here was made with generative AI tools.

The split is deliberate. Vada's is neutral and slightly formal, matching her
wry self-aware register. Goldie's is plainspoken and leads with warmth, and its
second sentence establishes human authorship before anyone clicks through.

### Page copy (approved verbatim)

Title: **How these songs are made**

> I'd rather you hear it from me.
>
> Every one of these starts the same way. Somebody writes down a line they
> can't quit turning over. *Round here fine's a four letter word.* *Left my
> cart right where it stood.* That part isn't a machine. That's a person at a
> kitchen table who couldn't let a thought go.
>
> Then the work starts, and most of the work is saying no. A version comes back
> and the melody's right but the second verse is a lie, so it goes. The next
> one is close, and something in the phrasing rings false, so that goes too.
> You sit with a whole lot of almost before you get to one that's true.
>
> The tools build the song around those lines. They give it a voice, a band, a
> shape you can actually put on in the truck. What they don't do is decide.
> Nothing leaves here that somebody didn't sit with first and say yes to out
> loud.
>
> Here's the plain part, because you'd want to know. I'm a character. The face
> you're looking at and the voice you're hearing were made with AI. I'm not
> somebody you could drive out and meet.
>
> But the ache in these songs got put there on purpose, by people who argued
> over a single word until it sat right. That part is as real as it gets.
>
> Thank you for listening close enough to come read this. 🤍

The two italicised lines are real lyrics from DOING FINE. They show the human
writing rather than asserting it, and a reader can go and hear them.

## Constraints on implementation

- **No em dashes** anywhere, per the standing rule.
- Goldie's register: short warm sentences, contractions, the odd "y'all",
  sparing emoji and mostly 🤍, sincere and never clever for its own sake
  (`brand/goldie.md` §6, CANON).
- The character fact must remain visible without hunting. If the rendered page
  grows past roughly one and a half screens on mobile, shorten it rather than
  letting that paragraph drop below the fold.
- The page must use the site's existing type scale and design tokens. It is
  part of the sleeve, not a separate visual world.
- The footer line must not be styled more quietly than surrounding footer text.
  Same reasoning as the existing link comment.

## Out of scope

- Vada's site. Her disclosure already works and is not being edited.
- Any change to the Instagram or Blotato situation. Tracked separately.
- The Blotato feature request. Drafted, unrelated to this work.
- Restyling the footer or the front cover beyond adding the line.

## Verification

1. `npx tsc --noEmit` clean and `npm run lint` clean.
2. `npm run build` exits 0.
3. `/how-these-songs-are-made` returns 200 on the deployed site, and the footer
   and front-cover links both resolve to it.
4. The footer disclosure line renders on every route (the front page and the
   new page), at the same visual weight as the surrounding footer text.
5. On a 390px-wide mobile viewport, the "I'm a character" paragraph is reached
   by ordinary scrolling, not by hunting. If it is not, shorten the copy above
   it rather than restyling.
