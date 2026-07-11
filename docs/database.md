# Database Design - LifeMax

This document details the database schema and relationships for LifeMax.

## Schema Overview

The database is built on PostgreSQL (hosted on Neon) and is defined in `server/prisma/schema.prisma`.

```
User
└── Categories
    └── Activities
        └── TimeBlocks (Derives analytics)
    └── DayLogs
    └── Goals
    └── Habits
        └── HabitEntries
```

## Tables & Models

- **User**: System users containing email, hashed passwords, and profile details.
- **Category**: High-level groups (e.g. Work, Gym, Sleep) that define whether an activity is productive or non-productive.
- **Activity**: Specific tasks (e.g. DSA, Anime, Gym) linked to a Category.
- **DayLog**: Daily log tracking notes, mood, energy, and sleep hours for a specific calendar day.
- **TimeBlock**: Tracks duration and details of active time spent on an Activity.
- **Goal**: Long-term objective tracking targets and progress.
- **Habit**: Recurring tasks with specified target frequencies per week.
- **HabitEntry**: Logs successful completions of a Habit on specific dates.
