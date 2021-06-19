## Projects

### GET `/project` [requires authentication]

Get all the projects currently visible to the authenticated user.

#### Response body

```typescript
interface Body {
    status: string;
    projects: {
        id: string;
        name: string;
        text: string;
        color: string;
        status: string;
        deadline?: string;
    }[];
}
```

### GET `/project/:uuid` [requires authentication]

Get the project with the given id, if it is visible to the currently authenticated user.

#### Response body

```typescript
interface Body {
    status: string;
    project: {
        id: string;
        name: string;
        text: string;
        color: string;
        status: string;
        deadline?: string;
        teams: string[];
    };
}
```

### GET `/project/:uuid/tasks` [requires authentication]

Get all tasks that belong to the project with the given id, if it is visible to the currently
authenticated user.

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

### GET `/project/:uuid/assigned` [requires authentication]

Get all users that are assigned to one of the tasks belonging to the project with the given id, if
it is visible to the currently authenticated user.

#### Response body

```typescript
interface Body {
    status: string;
    assigned: {
        id: string;
        username: string;
        email: string;
        realname: string;
        time: number;
    }[];
}
```

### GET `/project/:uuid/work?since=X&to=X` [requires authentication]

Get all work items for tasks belonging to the project with the given id, if it is visible to the
currently authenticated user.

#### Response body

```typescript
interface Body {
    status: string;
    work: {
        id: string,
        task: string,
        user: string,
        started: number,
        finished?: number,
    }[];
}
```

### GET `/project/activity?since=X&to=X` [requires authentication]

Get the activity for tasks belonging to the project with the given id, if it is visible to the
currently authenticated user.

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

Get the completion of tasks belonging to the project with the given id, if it is visible to the
currently authenticated user.

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

### POST `/project` [requires authentication]

Create a new project with the given data. On successful creation the id of the new projects will
be returned.

#### Request body

```typescript
interface Body {
    teams: string[];
    name: string;
    text: string;
    color: string;
    deadline?: string;
}
```

#### Response body

```typescript
interface Body {
    status: string;
    id: string;
}
```

### PUT `/project/:uuid` [requires authentication]

Update the project with the given id.

#### Request body

```typescript
interface Body {
    remove_teams?: string[];
    add_teams?: string[];
    name?: string;
    text?: string;
    color?: string;
    status?: string;
    deadline?: string;
}
```

