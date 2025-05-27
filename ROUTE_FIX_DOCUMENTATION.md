# Route Fix: Documentation Page

## Issue Resolved

Fixed the routing error: `No routes matched location "/docs"`

## Problem

The Footer component was linking to `/docs` but the actual route was defined as `/documentation` in the App.tsx file.

## Solution

Updated the Footer component to use the correct route path.

### File Changed

-   `src/components/layout/Footer.tsx`

### Change Made

```diff
- { name: 'Documentation', path: '/docs' },
+ { name: 'Documentation', path: '/documentation' },
```

## Verification

✅ **Build Success**: `npm run build` completes without errors
✅ **Route Consistency**: All documentation links now point to `/documentation`
✅ **Navigation Working**: Footer documentation link now works correctly

## Related Routes

All documentation-related routes are now consistent:

-   Route definition: `/documentation` (in App.tsx)
-   Footer link: `/documentation` (in Footer.tsx)
-   Help Center link: `/documentation` (in HelpCenter.tsx)
-   API page links: Reference documentation correctly

## Impact

-   Users can now successfully navigate to the Documentation page from the footer
-   No more routing errors when clicking the Documentation link
-   Consistent user experience across the application

## Status

✅ **RESOLVED** - Documentation route is now working correctly
