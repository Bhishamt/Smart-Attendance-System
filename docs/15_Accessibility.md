# Accessibility

## Standards

Compliance with **WCAG 2.1 Level AA** guidelines.

## Requirements

### Semantic HTML
- Use semantic elements (`nav`, `main`, `section`, `button`, etc.)
- Headings in proper hierarchy (h1 → h2 → h3)
- Landmark regions for screen reader navigation

### Keyboard Navigation
- All interactive elements focusable via Tab
- Visible focus indicators on all elements
- No keyboard traps
- Enter/Space activates buttons and links
- Escape closes modals and dropdowns

### ARIA
- Proper `aria-label` on icon-only buttons
- `aria-modal="true"` on dialog overlays
- `aria-expanded` on collapsible elements
- `role` attributes where semantic HTML insufficient
- Live regions (`aria-live`) for dynamic content updates

### Color & Contrast
- Minimum contrast ratio of 4.5:1 for normal text
- 3:1 for large text (18px+)
- Status colors not the only indicator (include text labels)
- Dark mode maintains contrast requirements

### Screen Readers
- Alt text on all images
- Meaningful link/button text (not "click here")
- Form inputs associated with labels
- Error messages announced to screen readers
