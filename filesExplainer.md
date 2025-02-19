
# Files Related to SSSP Dashboard Loading Issue

## Core Files
```
src/
├── pages/
│   └── Index.tsx                    # Main dashboard page component with SSSP data fetching and display 🔴
├── integrations/
│   └── supabase/
│       └── client.ts                # Supabase client configuration and initialization 🟡
├── types/
│   └── sssp.d.ts                    # TypeScript definitions for SSSP data structures 🟡
└── hooks/
    └── use-toast.ts                 # Toast notification hook for error handling 🟢
```

Emoji Key:
- 🔴 High imports/complexity (>10 imports)
- 🟡 Medium imports/complexity (5-10 imports)
- 🟢 Low imports/complexity (<5 imports)

# Issue Report: SSSP Dashboard Loading Error

## Error Description
The dashboard fails to load with the error:
```
Error loading data: infinite recursion detected in policy for relation "sssps"
```

## Technical Details
- Error Code: 42P17
- Component: Index.tsx
- Database: Supabase/PostgreSQL
- Feature: Row Level Security (RLS)

## Context
The error occurs during the initial data fetch for the SSSP dashboard. The issue is specifically related to Row Level Security policies in the database, not the frontend code.

## Relevant Code Snippets

### Data Fetching Function
```typescript
const fetchSSSPs = async () => {
  const { data, error } = await supabase
    .from('sssps')
    .select('id, title, status, created_at, updated_at, company_name')
    .order('created_at', { ascending: false })
    .throwOnError();
  // ... error handling
};
```

### Database Error Logs
```
[fetchSSSPs] Error details: {
  "name": "PostgrestError",
  "message": "infinite recursion detected in policy for relation \"sssps\"",
  "code": "42P17"
}
```

## Expected Behavior
- Dashboard should load and display SSSP data
- RLS policies should filter data based on user permissions
- Real-time updates should work for authorized users

## Actual Behavior
- Dashboard fails to load
- PostgreSQL reports infinite recursion in RLS policy
- No data is displayed to the user

## Root Cause Analysis
The issue stems from recursive RLS policies where:
1. The SELECT policy for the 'sssps' table creates a circular reference
2. The policy checks for access permissions recursively
3. This creates an infinite loop in the policy evaluation

## Dependencies
- @supabase/supabase-js: For database access
- @tanstack/react-query: For data fetching
- date-fns: For date manipulation
- lucide-react: For icons

## Steps to Reproduce
1. Log into the application
2. Navigate to the dashboard
3. Observe the error message instead of SSSP data

## Resolution Path
The issue has been addressed by:
1. Dropping existing RLS policies
2. Creating new, properly structured policies that avoid recursion
3. Implementing clear separation between different operation policies
4. Using explicit table qualifications in EXISTS clauses

## Additional Notes
- The frontend code is functioning correctly
- The issue is purely database-side
- Real-time subscriptions are properly configured but cannot function until the RLS issue is resolved
