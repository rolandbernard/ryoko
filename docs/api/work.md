## Work

### GET `/work` [requires authentication]

Get the information on the currently open work item of the authenticated user. If no item is open,
404 will be returned.

#### Response body

```typescript
interface Body {
    status: string;
    work: {
        id: string;
        task: string;
        user: string;
        started: number;
        finished?: number;
    };
}
```

### POST `/work/start` [requires authentication]

Create a new work item with the given data.  All open work items for the authenticated user will
also be closed in turn.  On successful creation the id of the new work item will be returned.

#### Request body

```typescript
interface Body {
    task: string;
}
```

#### Response body

```typescript
interface Body {
    status: string;
    id: string;
}
```

### PUT `/work/finish` [requires authentication]

Finish the currently open work of the authenticated user. If no item is open, 404 will be returned.

