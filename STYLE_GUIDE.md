# Holidaze Style Guide

Purpose

- Provide consistent conventions for code, markup, styles, commits, and reviews.
- Make contributions predictable, readable, and maintainable.
- Reflect the project's primary language: JavaScript (ES6+), with HTML and CSS.

Table of contents

- Quick start
- Formatting & editor config
- JavaScript
  - Syntax & features
  - File & folder structure
  - Naming
  - Comments & documentation
  - Error handling & async
  - Testing and linting
- HTML
- CSS
- Assets & static files
- Git, branches, commits & PRs
- Code review checklist
- Helpful snippets

Quick start

- Use Node 16+ (or the version defined in `.nvmrc` if present).
- Install dependencies: `npm install`
- Run lint: `npm run lint` (if configured)
- Run tests: `npm test` (if configured)

Formatting & editor config

- Indentation: 2 spaces.
- Line length: 100 characters.
- Trailing semicolons: Yes (use semicolons to avoid ASI pitfalls).
- Quotes: Single quotes in JavaScript; double quotes in HTML attributes.
- End files with a newline.
- Use Prettier and ESLint together. Add an `.editorconfig` and `.prettierrc` to the repo to enforce editor behavior.

JavaScript (ES6+)

- Use modern syntax (const/let, arrow functions, template literals, destructuring, spread/rest).
- Prefer `const` for values that are not reassigned; use `let` only when necessary.
- Use arrow functions for short callbacks and function expressions. Use `function` declarations for named functions where hoisting or `this` behavior matters.
- Modules: use ES modules (`import` / `export`) where supported.
- Avoid creating globals. Keep DOM / window access contained to small modules.

File & folder structure (recommended)

- src/
  - api/ — network / API logic
  - components/ — reusable UI bits (if applicable)
  - pages/ — page-level scripts
  - utils/ — small pure helpers
  - styles/ — global CSS / variables
- public/ or static/ — static assets
- tests/ — unit/integration tests

File naming

- JavaScript files: kebab-case or camelCase (pick one consistently; recommend kebab-case for filenames: `user-list.js`).
- Directories: kebab-case.
- Component modules (if component is a class): PascalCase for exported class names.

Naming conventions

- Variables & functions: camelCase.
- Classes/constructors: PascalCase.
- Constants: UPPER_SNAKE_CASE for compile-time-like constants (rare).
- Boolean variables: prefix with `is`, `has`, `should` when helpful (e.g., `isVisible`).

Code style rules

- Use single quotes for strings: `'text'`.
- Use template literals for string interpolation: `` `Hello ${name}` ``.
- Add trailing commas in multiline objects/arrays where applicable.
- Prefer explicit return values.
- Keep functions small (single responsibility) and prefer pure functions for logic where possible.

Comments & documentation

- Use JSDoc for exported/public functions and modules:
  ```js
  /**
   * Fetch list of offers.
   * @param {Object} opts - request options
   * @returns {Promise<Array>}
   */
  export async function fetchOffers(opts) { ... }
  ```
- Write comments explaining "why" more than "what".
- Remove commented-out code before merging.

Error handling & async

- Use `async/await` with try/catch for async flows.
- Avoid silent failures; surface errors to caller or log with context.
- Normalize network errors where possible (e.g., create an `apiError` wrapper).

Testing & linting

- Add unit tests for pure functions.
- Test edge cases and async flows.
- Use ESLint with a shared baseline (Airbnb or recommended rules) and Prettier for formatting.
- Add npm scripts:
  - `npm run lint`
  - `npm run lint:fix`
  - `npm run format`
  - `npm test`

HTML

- Use semantic HTML elements (`main`, `header`, `nav`, `section`, `article`, `footer`).
- Indentation: 2 spaces.
- Attribute order: logical grouping is fine; avoid arbitrary re-ordering.
- Use meaningful alt text for images.
- Prefer progressive enhancement: content first, JS improves experience.
- Keep templates small and focused.

Accessibility (A11y)

- Provide `alt` for images.
- Ensure interactive controls are reachable via keyboard (use `<button>`, not clickable `<div>`).
- Use labels for form controls and `aria-*` where appropriate.
- Ensure color contrast meets WCAG AA wherever possible.
- Include a visible "skip to content" link for keyboard users.

CSS

- Use BEM-style naming for component classes: `.component`, `.component__element`, `.component--modifier`.
- Class names: kebab-case.
- Keep CSS modular: scope styles to components or files.
- Prefer CSS variables for theme values (colors, spacing): `--color-primary`.
- Avoid `!important`. If needed, document why and scope narrowly.
- Order properties logically (positioning, box model, typography, visuals).
- Use a reset or normalize as appropriate.

Assets & static files

- Optimize images (use modern formats where practical: WebP, AVIF) and provide fallbacks for browsers that need them.
- Store SVGs as inline when interactive or as files when decorative and cacheable.
- Use descriptive filenames and organize by purpose (icons/, images/, fonts/).

Git, branches, commits & PRs

- Branch naming: `feature/short-description`, `fix/short-description`, `chore/short-description`.
- Commit messages: use Conventional Commits style:
  - `feat: add booking form`
  - `fix(api): handle 404 on offers`
  - `docs: update README`
- Open PRs with:
  - Title and description with what changed, why, and relevant issue numbers.
  - Link to screenshots or steps to test if UI affected.
  - Assign reviewers and add labels.
- Rebase or squash commits for a clean history (follow project policy).

Code review checklist

- Does the change compile and run?
- Are there tests or updated tests for new behavior?
- Is the code readable and small enough to review?
- Are edge cases & error flows handled?
- Are accessibility considerations addressed?
- Are there any performance regressions?
- Documentation / changelog updated if needed.

Examples

JavaScript

```js
// src/utils/format-date.js
/**
 * Format a date to `YYYY-MM-DD`.
 * @param {Date|string|number} input
 * @returns {string}
 */
export function formatDate(input) {
  const d = new Date(input);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
```

HTML

```html
<a class="skip-link" href="#main">Skip to content</a>
<main id="main">
  <h1>Holidaze</h1>
</main>
```

CSS (BEM)

```css
.card {
  /* block */
  --card-padding: 1rem;
  padding: var(--card-padding);
}
.card__title {
  /* element */
}
.card--highlight {
  /* modifier */
}
```

What to add to the repo (recommended next steps)

- `.editorconfig` to standardize editors.
- `.prettierrc` and `.eslintrc.json` (extend an established config).
- A `CONTRIBUTING.md` that references this style guide.
- Optional: Git hooks (husky) to run `lint` and `format` before commit.

If you want, I can:

- Add `.eslintrc` / `.prettierrc` / `.editorconfig` templates.
- Open a PR adding this `STYLE_GUIDE.md` to the repository.
- Generate runnable configuration (npm scripts + husky pre-commit) for you.
