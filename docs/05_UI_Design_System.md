# UI Design System

## Design Philosophy

Clean, modern, and accessible interface with a focus on data clarity and ease of use.

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| primary | `#3B82F6` | Buttons, active elements, links |
| success | `#10B981` | Present status, positive metrics |
| warning | `#F59E0B` | Late status, pending items |
| danger | `#EF4444` | Absent status, destructive actions |
| bg-primary | `#0F172A` | Main background (dark mode) |
| bg-card | `#1E293B` | Card backgrounds |
| text-primary | `#F8FAFC` | Primary text |
| text-secondary | `#94A3B8` | Secondary text |

## Typography

| Type | Font | Weight | Size |
|------|------|--------|------|
| Headings | Inter | 700 | 1.25-2rem |
| Body | Inter | 400 | 0.875rem |
| Data/Labels | Poppins | 500-600 | 0.75-0.875rem |

## Components

### Glass Card
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
```

### Statistics Card
Minimal layout with icon, value, label, and trend indicator.

### Buttons
- Primary: Solid blue background
- Success: Green for confirm actions
- Danger: Red for destructive actions
- Ghost: Transparent with hover state

### Status Badges
- Present: Green pill
- Absent: Red pill
- Late: Amber pill
