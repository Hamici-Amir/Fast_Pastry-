# PROMPT: Clean Expo Template Leftover Files

## Files to Fix

### 1. `app/modal.tsx`
This file still contains the Expo Router starter template content:
- Imports from `@/components/themed-text` and `@/components/themed-view`
- Placeholder text: "This is a modal" and "Go to home screen"
- References template components that are Expo defaults, not app-specific

**Fix**: 
- **Option A**: Replace with actual modal content (e.g., order confirmation, terms of service, etc.)
- **Option B**: If not used, delete the file and remove any references to `/modal` from navigation
- **Option C**: Keep as-is if it's genuinely used as a presentation modal, but update the content to be app-specific

Check if any file imports or navigates to `/modal`:
```bash
rg "modal" --include "*.tsx" --include "*.ts" -l
```

### 2. `app/(tabs)/explore.tsx`
This has already been converted to a redirect to catalogue. It's a stub that serves no purpose beyond redirecting. 

**Fix**: Consider removing it from the tab navigator and the file system if the explore tab is not needed. Update `app/(tabs)/_layout.tsx` to remove the explore tab from the tab list.

## What to Do
1. Read each file
2. Remove or replace template boilerplate content with real app content
3. Do NOT add comments

## Verify
1. No Expo onboarding text ("This app includes example code to help you get started") appears anywhere
2. No references to template component paths (`@/components/themed-text`, `@/components/parallax-scroll-view`, etc.) remain in app-owned files
3. All routes compile without errors
