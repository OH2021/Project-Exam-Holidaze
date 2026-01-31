# Holidaze Style Guide

## 1. Color Palette (Tailwind based)

| Purpose                             | Tailwind Class       | Hex Value |
| ----------------------------------- | -------------------- | --------- |
| Primary (buttons, highlights)       | `bg-blue-600`        | `#2563EB` |
| Primary Hover                       | `hover:bg-blue-700`  | `#1D4ED8` |
| Success / Booking                   | `bg-green-600`       | `#16A34A` |
| Success Hover                       | `hover:bg-green-700` | `#15803D` |
| Destructive / Logout                | `bg-red-600`         | `#DC2626` |
| Destructive Hover                   | `hover:bg-red-700`   | `#B91C1C` |
| Secondary / Neutral (View Bookings) | `bg-gray-700`        | `#374151` |
| Light Gray Background / cards       | `bg-gray-100`        | `#F3F4F6` |
| Gray text                           | `text-gray-600`      | `#4B5563` |
| Dark Text                           | `text-gray-900`      | `#111827` |
| Borders / subtle                    | `border-gray-200`    | `#E5E7EB` |

## 2. Typography

Font stack:

```
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
```

| Element          | Tailwind Class             |
| ---------------- | -------------------------- |
| Page Title       | `text-3xl font-bold`       |
| Section Heading  | `text-2xl font-semibold`   |
| Subheading       | `text-xl font-semibold`    |
| Button text      | `text-white font-semibold` |
| Normal body text | `text-base text-gray-700`  |

## 3. Buttons

### Primary (Blue)

```html
class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
```

### Success / Positive (Green)

```html
class="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2
rounded"
```

### Destructive (Red)

```html
class="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
```

### Secondary / Neutral (Gray)

```html
class="bg-gray-700 text-white font-semibold px-4 py-2 rounded"
```

## 4. Layout & Spacing

| Spacing          | Utility          |
| ---------------- | ---------------- |
| Small padding    | `p-2`            |
| Standard spacing | `p-4`            |
| Bigger spacing   | `p-6`, `p-8`     |
| Grid gaps        | `gap-4`, `gap-6` |
| Margins          | `mb-4`, `mt-6`   |

## 5. Imagery

Venue images:

```html
class="w-full h-48 object-cover rounded"
```

Placeholder image:

```
https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=crop&h=300&w=400
```

## 6. Form Fields & Inputs

```html
class="border p-2 w-full rounded"
```

## 7. Alerts & Messages

- Success: `text-green-600`
- Error: `text-red-600`

## 8. Tailwind Utility Map

| Category    | Tailwind Prefix        |
| ----------- | ---------------------- |
| Background  | `bg-`                  |
| Text Color  | `text-`                |
| Border      | `border-`              |
| Padding     | `p-`, `px-`, `py-`     |
| Margin      | `m-`, `mb-`, `mt-`     |
| Flex & Grid | `flex`, `grid`, `gap-` |
| Font        | `font-`, `text-`       |

## Usage Notes

1. **Primary buttons** for main actions (login, register, submit).
2. **Success buttons** for bookings and confirmations.
3. **Destructive buttons** for logout or delete actions.
4. **Neutral buttons** for secondary actions like navigating to bookings.

---

**Colors Summary:**

- Blue: `#2563EB`
- Green: `#16A34A`
- Red: `#DC2626`
- Gray neutrals: `#374151`, `#F3F4F6`
