## Tasks

### GET `/task` [requires authentication]

Get all the tasks currently visible to the authenticated user.

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

### GET `/task/:status` [requires authentication]

Get all the tasks currently visible to the authenticated user that have the given status. Status can
be any of 'open', 'closed', or 'suspended'.

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

### GET `/task/possible` [requires authentication]

Get all the tasks currently visible to the authenticated user that are currently open and have no
open dependencies.

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

### GET `/task/:uuid` [requires authentication]

Get information about the task with the given id.

#### Response body

```typescript
interface Body {
    status: string;
    task: {
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
    };
}
```

### GET `/task/:uuid` [requires authentication]

Get information about the task with the given id.

#### Response body

```typescript
interface Body {
    status: string;
    task: {
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
    };
}
```

### GET `/task/:uuid/comments` [requires authentication]

Get all comments that belong to the task with the given id.

#### Response body

```typescript
interface Body {
    status: string;
    comments: {
        id: string;
        task: string;
        user: string;
        text: string;
        created: number;
        edited: number;
    }[];
}
```

### GET `/task/:uuid/work` [requires authentication]

Get all work done for the task with the given id.

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
    }[];
}
```

### GET `/task/:uuid/assigned` [requires authentication]

Get all users that are assigned to the task with the given id.

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

### POST `/task` [requires authentication]

Create a new task with the given data. On successful creation the id of the new tasks will
be returned.

#### Request body

```typescript
interface Body {
    project: string;
    name: string;
    text: string;
    icon: string;
    priority: string;
    dependencies: string[];
    requirements: {
        role: string;
        time: number;
    }[];
    assigned: {
        user: string;
        time: number;
        finished?: boolean;
    }[];
}
```

#### Response body

```typescript
interface Body {
    status: string;
    id: string;
}
```

### PUT `/task/:uuid` [requires authentication]

Update the task with the given id.

#### Request body

```typescript
interface Body {
    name?: string;
    text?: string;
    icon?: string;
    priority?: string;
    status?: string;
    remove_dependencies?: string[];
    remove_requirements?: string[];
    remove_assigned?: string[];
    add_dependencies?: string[];
    add_requirements?: {
        role: string;
        time: number;
    }[];
    add_assigned?: {
        user: string;
        time: number;
        finished?: boolean;
    }[];
}
```

