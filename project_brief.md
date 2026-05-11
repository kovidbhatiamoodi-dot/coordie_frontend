# Coordie Portal Rebuild Brief

## Goal
Rebuild the coordinator portal from scratch with improved UI/UX, minimalist but fun animations, and a mobile-first experience.

## Core Flow
1. Hero section describing "Moodi" with an image placeholder and a background animation.
2. Department overview section with cards, each describing a department in 1-2 sentences, with playful animations.
3. Card game section (trolling quiz):
   - 3D cylindrical layout of cards.
   - Only the current card is clearly visible; previous/next cards are blurred.
   - Each card is a two-option MCQ (single correct choice).
   - User must answer before moving to the next card.
   - Horizontal scrolling to move to the next card.
   - Vertical scrolling is locked while in the game section.
   - On answer, card flips and shows a trolling statement.
4. After 6 questions, show a final card:
   - Message: "All this doesn't matter — you can still become a coordinator."
   - "Register Now" button.
5. Registration form:
   - Opened via "Register Now".
   - Also accessible from navbar.
   - Collects student details (placeholders for now).
   - Includes ID card preview with placeholders.
   - Student name updates live on the ID card.
   - User can download the ID card only after registration completes.
   - ID card image placeholder; user will provide coordinates later.

## Backend Requirement
Create a separate backend project in a different folder.
- Receives student details submitted after the card game.
- Placeholder endpoints are acceptable for now.
- Data should be prepared to save to a database; for now, accept inputs and leave MySQL connection as a placeholder (user will add later).

## Content Notes
- Questions and trolling statements will be added later; use placeholders.
- User may add images later.

## Tech/Animation
- Can use Framer Motion, Three.js, or other libraries.
- Minimalist, fun animations with a high-quality animation library.

## Mobile
- Must work well on mobile devices.
- Layouts should be responsive, touch-friendly.
