## Authentication

### POST `/auth/register`

Register a new user account with the given username and password. Optionally a email and real name
can also be supplied.

#### Request body

```typescript
interface Body {
    username: string;
    password: string;
    email?: string;
    realname?: string;
}
```

#### Response body

```typescript
interface Body {
    status: string;
    token: string;
}
```

### POST `/auth/token`

Request a authentication token for this API. Only if the username and password match one of the
users registered, a token for authentication will be generated and returned.

#### Request body

```typescript
interface Body {
    username: string;
    password: string;
}
```

#### Response body

```typescript
interface Body {
    status: string;
    token: string;
}
```

### GET `/auth/extend` [requires authentication]

Request an extension of the token that is used during the request. After successful extension the
new token will be returned in the response body.

#### Response body

```typescript
interface Body {
    status: string;
    token: string;
}
```

### PUT `/auth/username` [requires authentication]

Request a change of the username for the current user.

#### Request body

```typescript
interface Body {
    username: string;
}
```

### PUT `/auth/password` [requires authentication]

Request a change of the password for the current user.

#### Request body

```typescript
interface Body {
    password: string;
}
```
