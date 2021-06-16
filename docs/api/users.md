## Users

### GET `/user/name/:username`

Request a users id based on his username. This will return 404 if the user does not exist in the
service.

#### Response body

```typescript
interface Body {
    status: string;
    user: {
        id: string;
        username: string;
    };
}
```

### GET `/user/:uuid/image`

Get the image avatar for the user with the given uuid. If the user does not exist or the user has
not set a avatar 404 will be returned. The returned image has the `Content-Type` set to `image/png`.

### GET `/user/` [requires authentication]

Get information on the user that is authenticated in the request.

#### Response body

```typescript
interface Body {
    status: string;
    user: {
        id: string;
        username: string;
        email: string;
        realname: string;
    };
}
```

### GET `/user/tasks` [requires authentication]

Get all the tasks that the authenticated user is assigned to and are not yet finished.

#### Response body

```typescript
interface Body {
    status: string;
    tasks: {
        id: string;
        project: string;
        name: string;
        text: string;
        icon: string;
        priority: string;
        status: string;
        dependencies: string[];
        requirements: {
            role: string;
            time: number;
        }[];
        assigned: {
            user: string;
            time: number;
            finished: boolean;
        }[];
        created: number;
        edited: number;
        color: string;
    }[];
}
```

### GET `/user/work?since=X&to=X` [requires authentication]

Get all the work items created by the authenticated user.

#### Response body

```typescript
interface Body {
    status: string;
    work: {
        id: string;
        task: string;
        user: string;
        started: number;
        finished: number;
    }[];
}
```

### GET `/user/activity?since=X&to=X` [requires authentication]

Get the activity for the authenticated user.

#### Response body

```typescript
interface Body {
    status: string;
    activity: {
        day: string;
        time: number;
    }[];
}
```

### GET `/user/completion?since=X&to=X` [requires authentication]

Get the completion data for all tasks the user is assigned to.

#### Response body

```typescript
interface Body {
    status: string;
    completion: {
        open: number;
        closed: number;
        suspended: number;
        overdue: number;
    };
}
```

### PUT `/user/` [requires authentication]

Request an update to the authenticated users information.

#### Request body

```typescript
interface Body {
    realname?: string;
    email?: string;
}
```

### PUT `/user/image` [requires authentication]

Update the image of the authenticated user. The image should be submitted as a file element in a
FormData object called `image`.

### GET `/user/:uuid` [requires authentication]

Get information on the user with the given uuid.

#### Response body

```typescript
interface Body {
    status: string;
    user: {
        id: string;
        username: string;
        email: string;
        realname: string;
    };
}
```

