# Component Guidelines

## Component Architecture

All reusable components live in `frontend/src/components/` and full-page views in `frontend/src/screens/`.

## Existing Components

| Component | Purpose |
|-----------|---------|
| Navbar | Top navigation with AI, Drive, notifications, profile menu |
| Sidebar | Desktop sidebar navigation |
| BottomNav | Mobile bottom navigation bar |
| AddStudentModal | Modal for adding/editing students with biometric scan |
| AddStaffModal | Modal for adding HOD/Teacher |
| AiAssistantModal | AI chat modal for attendance analysis |
| CloudStorageModal | Google Drive backup/restore modal |

## Component Patterns

- **Props**: Define TypeScript interfaces for all props
- **State**: Use React state hooks; avoid prop drilling beyond 2 levels
- **Styling**: Use Tailwind CSS utility classes; use `cn()` from `tailwind-merge` for conditional classes
- **Icons**: Use `lucide-react` exclusively
- **Animations**: Use `motion` from the `motion` package for transitions

## Modal Pattern

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

## Screen Pattern

```typescript
export default function ScreenName() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {/* Screen content */}
    </div>
  );
}
```
