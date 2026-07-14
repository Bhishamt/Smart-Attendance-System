# Git Workflow

## Branch Strategy

```
main          ─── Production-ready code
develop       ─── Integration branch
feature/*     ─── New features
fix/*         ─── Bug fixes
docs/*        ─── Documentation changes
```

## Commit Convention

Follow conventional commits:

| Type | Usage |
|------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `refactor:` | Code refactoring |
| `style:` | Formatting, styling |
| `chore:` | Build, deps, config |
| `test:` | Adding tests |

## Commit Message Format

```
type(scope): Brief description

Optional body with details
```

**Examples:**
- `feat(attendance): Add batch marking for multiple students`
- `fix(dashboard): Correct weekly trend calculation`
- `docs: Add API specification`

## Pull Request Process

1. Create feature branch from `develop`
2. Make changes with small, focused commits
3. Open PR against `develop`
4. Request review from at least one peer
5. Squash merge with conventional commit message
6. Delete feature branch after merge
