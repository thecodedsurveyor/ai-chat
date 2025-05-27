# Offline Storage Linting Fixes

## Issue Resolved

Fixed ESLint errors in `src/utils/offlineStorage.ts` related to unnecessary try/catch wrappers.

## Problem

The file had 3 ESLint errors due to the `no-useless-catch` rule:

```
src/utils/offlineStorage.ts
  279:3  error  Unnecessary try/catch wrapper  no-useless-catch
  321:3  error  Unnecessary try/catch wrapper  no-useless-catch
  338:3  error  Unnecessary try/catch wrapper  no-useless-catch
```

These errors occurred because the catch blocks were simply re-throwing the caught errors without adding any additional processing, making them redundant.

## Root Cause

The problematic pattern was:

```typescript
try {
	// ... some async operations
} catch (error) {
	// Failed to do something - handle silently
	throw error; // ❌ This just re-throws without adding value
}
```

This pattern violates the `no-useless-catch` ESLint rule because the try/catch block doesn't provide any benefit over letting the error propagate naturally.

## Solution

Removed the unnecessary try/catch wrappers from three methods:

### 1. `clearOfflineData()` Method

**Before:**

```typescript
static async clearOfflineData(): Promise<void> {
    try {
        const db = await this.initDB();
        // ... database operations
    } catch (error) {
        // Failed to clear offline data - handle silently
        throw error;
    }
}
```

**After:**

```typescript
static async clearOfflineData(): Promise<void> {
    const db = await this.initDB();
    // ... database operations
}
```

### 2. `exportOfflineData()` Method

**Before:**

```typescript
static async exportOfflineData(): Promise<OfflineData> {
    try {
        const chats = await this.getOfflineChats();
        return {
            chats,
            lastSync: new Date().toISOString(),
            version: '1.0.0',
        };
    } catch (error) {
        // Failed to export offline data - handle silently
        throw error;
    }
}
```

**After:**

```typescript
static async exportOfflineData(): Promise<OfflineData> {
    const chats = await this.getOfflineChats();
    return {
        chats,
        lastSync: new Date().toISOString(),
        version: '1.0.0',
    };
}
```

### 3. `importOfflineData()` Method

**Before:**

```typescript
static async importOfflineData(data: OfflineData): Promise<void> {
    try {
        // Clear existing data first
        await this.clearOfflineData();
        // ... import operations
    } catch (error) {
        // Failed to import offline data - handle silently
        throw error;
    }
}
```

**After:**

```typescript
static async importOfflineData(data: OfflineData): Promise<void> {
    // Clear existing data first
    await this.clearOfflineData();
    // ... import operations
}
```

## Benefits

1. **Cleaner Code**: Removed unnecessary boilerplate code
2. **Better Performance**: Eliminated redundant error handling overhead
3. **ESLint Compliance**: Fixed all linting errors
4. **Maintained Functionality**: Error propagation still works correctly

## Verification

-   ✅ ESLint passes with no errors: `npx eslint src/utils/offlineStorage.ts`
-   ✅ TypeScript compilation successful: `npx tsc --noEmit`
-   ✅ Build successful: `npm run build`
-   ✅ All functionality preserved

## Impact

-   **No Breaking Changes**: The API and behavior remain exactly the same
-   **Error Handling**: Errors still propagate correctly to calling code
-   **Code Quality**: Improved adherence to ESLint best practices

## Status

✅ **COMPLETED** - All linting errors in `offlineStorage.ts` have been resolved.

The file now follows ESLint best practices while maintaining all original functionality and error handling behavior.
