## Comments

### GET `/comment/:uuid` [requires authentication]

Get information on the comment with the given id.

#### Response body

```typescript
interface Body {
    status: string;
    comment: {
        id: string;
        task: string;
        user: string;
        text: string;
        created: number;
        edited: number;
    };
}
```

### POST `/comment` [requires authentication]

Create a new comment with the given data. On successful creation the id of the new comment will
be returned.

#### Request body

```typescript
interface Body {
    task: string;
    text: string;
}
```

#### Response body

```typescript
interface Body {
    status: string;
    id: string;
}
```

### PUT `/comment/:uuid` [requires authentication]

Update the comment with the given id.

#### Request body

```typescript
interface Body {
    text: string;
}
```

