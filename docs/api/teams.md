## Teams

### POST `team` [requires authentication]

Create a new team with the given name. On successful creation the id of the new team will be
returned.

#### Request body

```typescript
interface Body {
    name: string;
}
```

#### Response body

```typescript
interface Body {
    status: string;
    id: string;
}
```

### PUT `team/:uuid` [requires authentication]

Update the team with the given id.

#### Request body

```typescript
interface Body {
    name: string;
}
```

### GET `team/` [requires authentication]

Return all the teams the authenticated user is a member of.

#### Response body

```typescript
interface Body {
    status: string;
    teams: {
        id: string;
        name: string;
        role: string;
    }[];
}
```

### GET `team/:uuid` [requires authentication]

Return the team with the given id. If the authenticated user is a member of the team, the role will
also be included.

#### Response body

```typescript
interface Body {
    status: string;
    team: {
        id: string;
        name: string;
        role?: string;
    };
}
```

### GET `team/:uuid/members` [requires authentication]

Get all the users that are members of the team with the given id.
Only teams that the authenticated user is a member of are visible to this function.

#### Response body

```typescript
interface Body {
    status: string;
    members: {
        id: string;
        username: string;
        email: string;
        realname: string;
        role: {
            id: string;
            name: string;
        };
    }[];
}
```

### GET `team/:uuid/roles` [requires authentication]

Get all the roles of the team with the given id.
Only teams that the authenticated user is a member of are visible to this function.

#### Response body

```typescript
interface Body {
    status: string;
    roles: {
        id: string;
        name: string;
    }[];
}
```

### GET `team/:uuid/projects` [requires authentication]

Get all the projects of the team with the given id.
Only teams that the authenticated user is a member of are visible to this function.

#### Response body

```typescript
interface Body {
    status: string;
    projects: {
        id: string;
        name: string;
        text: string;
        color: string;
        status: 'open' | 'closed' | 'suspended';
        deadline: string,
    }[];
}
```

### GET `team/:uuid/work` [requires authentication]

Get all the work of members of the team with the given id.
Only teams that the authenticated user is a member of are visible to this function.

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

### GET `team/:uuid/activity` [requires authentication]

Get all the activity of members of the team with the given id.
Only teams that the authenticated user is a member of are visible to this function.

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

### GET `team/:uuid/completion` [requires authentication]

Get all the completion of all tasks in the projects of the team with the given id.
Only teams that the authenticated user is a member of are visible to this function.

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

### POST `team/:uuid/roles` [requires authentication]

Create a new role in the team with the given id.
Only teams that the authenticated user is a member of are visible to this function.

#### Request body

```typescript
interface Body {
    name: string;
}
```

### PUT `team/:teamid/roles/:roleid` [requires authentication]

Update the role with the given role id in the team with the given team id.
Only teams that the authenticated user is a member of are visible to this function.

#### Request body

```typescript
interface Body {
    name: string;
}
```

### DELETE `team/:teamid/roles/:roleid` [requires authentication]

Delete the role with the given role id in the team with the given team id. This request will fail if
any member of the team still has the given role.
Only teams that the authenticated user is a member of are visible to this function.

### POST `team/:uuid/members` [requires authentication]

Add a new members to the team with the given id.
Only teams that the authenticated user is a member of are visible to this function.

#### Request body

```typescript
interface Body {
    user: string;
    role: string;
}
```

### PUT `team/:teamid/members` [requires authentication]

Update the member with the given user id in the team with the given team id.
Only teams that the authenticated user is a member of are visible to this function.

#### Request body

```typescript
interface Body {
    user: string;
    role: string;
}
```

### DELETE `team/:teamid/members/:roleid` [requires authentication]

Remove the member with the given user id in the team with the given team id.
Only teams that the authenticated user is a member of are visible to this function.

### DELETE `team/:teamid/` [requires authentication]

Cause the authenticated user to leave the team with the given id. This will not delete the team, and
all other members are still members of the team.

