# Database Design

## Data Models

The system currently uses an **in-memory data store** with the following TypeScript interfaces:

### Student

```typescript
interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  class: string;
  section: string;
  department: string;
  status: 'active' | 'inactive';
  approved: boolean;
  joinDate: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  image?: string;
}
```

### AttendanceActivity

```typescript
interface AttendanceActivity {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  time: string;
  markedBy: string;
}
```

### ClassInfo

```typescript
interface ClassInfo {
  id: string;
  name: string;
  section: string;
  subject: string;
  department: string;
  schedule: string;
  teacher: string;
}
```

### Staff

```typescript
interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'hod' | 'teacher';
  department: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
}
```

### DashboardStats

```typescript
interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
  todayPresent: number;
  todayAbsent: number;
  todayLate: number;
  overallPercentage: number;
  weeklyTrend: { day: string; present: number; absent: number }[];
  departmentWise: { department: string; present: number; absent: number; total: number }[];
  recentActivity: AttendanceActivity[];
  heatmapData: { date: string; count: number }[];
}
```

## Future Database Migration

For production, migrate to a persistent database:

| Table | Purpose |
|-------|---------|
| users | Students, staff, admins with roles |
| attendance | Daily attendance records |
| classes | Subject and class definitions |
| departments | Department organization |
| settings | System configuration |
| backup_logs | Cloud backup history |
