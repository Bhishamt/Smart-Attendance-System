# Coding Standards

## TypeScript

- Use strict TypeScript with `strict: true` in tsconfig
- Define interfaces for all data structures
- Avoid `any` — use proper types or `unknown`
- Use `const` over `let` where possible

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `DashboardView.tsx` |
| Functions | camelCase | `markAttendance()` |
| Variables | camelCase | `totalStudents` |
| Files (React) | PascalCase | `StudentProfileView.tsx` |
| Files (utils) | camelCase | `apiHelpers.ts` |
| Types/Interfaces | PascalCase | `AttendanceActivity` |
| CSS classes | kebab-case | `glass-card` |

## React Patterns

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and under 300 lines
- Use TypeScript for all props and state
- Avoid class components

## CSS/Styling

- Use Tailwind CSS utility classes
- Use `cn()` utility for conditional class merging
- Global styles in `index.css` only for base/font/animations
- Prefer inline Tailwind over custom CSS

## Error Handling

- Wrap API calls in try/catch
- Show user-friendly error messages
- Log errors to console in development only
