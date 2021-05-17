
import express from 'express';
import { v4 as uuid, validate } from 'uuid';

import database from '../database';
import { requireVerification, Token } from './auth';
import { isOfType } from '../util';

const team = express();

team.use(requireVerification);

interface CreateTeamBody {
    name: string;
    token: Token;
}

team.post('/', async (req, res) => {
    if (isOfType<CreateTeamBody>(req.body, [['name', 'string']])) {
        const team_id = uuid();
        const role_id = uuid();
        const team_name = req.body.name;
        try {
            await database.transaction(async transaction => {
                await transaction('teams').insert({
                    id: team_id,
                    name: team_name,
                });
                await transaction('roles').insert({
                    id: role_id,
                    team_id: team_id,
                    name: 'Default',
                });
                await transaction('team_members').insert({
                    user_id: req.body.token.id,
                    team_id: team_id,
                    role_id: role_id,
                });
            });
            res.status(200).json({
                status: 'success',
                id: team_id,
            });
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed create team',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

interface UpdateTeamBody {
    name: string;
    token: Token;
}

team.put('/:uuid', async (req, res) => {
    if (isOfType<UpdateTeamBody>(req.body, [['name', 'string']])) {
        const team_id = req.params.uuid;
        if (validate(team_id)) {
            const team_name = req.body.name;
            try {
                const team = await database('teams')
                    .leftJoin('team_members', 'teams.id', 'team_members.team_id')
                    .select({ id: 'teams.id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'teams.id': team_id,
                    });
                if (team.length >= 1) {
                    await database('teams')
                        .update({
                            name: team_name,
                        })
                        .where({
                            'teams.id': team_id,
                        })
                    res.status(200).json({
                        status: 'success',
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'team not found',
                    });
                }
            } catch (e) {
                res.status(400).json({
                    status: 'error',
                    message: 'failed update team',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

team.get('/', async (req, res) => {
    try {
        const teams = await database('team_members')
            .innerJoin('teams', 'team_members.team_id', 'teams.id')
            .select({
                id: 'teams.id',
                name: 'teams.name',
                role: 'team_members.role_id'
            })
            .where({
                'team_members.user_id': req.body.token.id
            });
        res.status(200).json({
            status: 'success',
            teams: teams,
        });
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed to get teams',
        });
    }
});

team.get('/:uuid/', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const team = await database('teams')
                .leftJoin('team_members', 'teams.id', 'team_members.team_id')
                .select({
                    id: 'teams.id',
                    name: 'teams.name',
                    role: 'team_members.role_id',
                })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'teams.id': id,
                })
                .orWhere({
                    'team_members.user_id': null,
                    'teams.id': id,
                })
            if (team.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    team: team[0],
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'team not found',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get team',
        });
    }
});

team.get('/:uuid/members', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const members = await database({ ut: 'team_members'})
                .innerJoin({ tm: 'team_members'}, 'ut.team_id', 'tm.team_id')
                .innerJoin({ members: 'users'}, 'tm.user_id', 'members.id')
                .innerJoin('roles', 'tm.role_id', 'roles.id')
                .select({
                    id: 'members.id',
                    name: 'members.user_name',
                    email: 'members.email',
                    realname: 'members.real_name',
                    role_id: 'roles.id',
                    role_name: 'roles.name',
                })
                .where({
                    'ut.user_id': req.body.token.id,
                    'ut.team_id': id,
                });
            if (members.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    members: members.map(member => ({
                        id: member.id,
                        name: member.name,
                        email: member.email,
                        realname: member.realname,
                        role: {
                            id: member.role_id,
                            name: member.role_name,
                        },
                    })),
                });
            } else {
                // All teams have members
                res.status(404).json({
                    status: 'error',
                    message: 'team not found',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get members',
        });
    }
});

team.get('/:uuid/roles', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const roles = await database('team_members')
                .innerJoin('roles', 'team_members.team_id', 'roles.team_id')
                .select({
                    id: 'roles.id',
                    name: 'roles.name',
                })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'team_members.team_id': id,
                });
            if (roles.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    roles: roles,
                });
            } else {
                // All teams have at least one role
                res.status(404).json({
                    status: 'error',
                    message: 'team not found',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get roles',
        });
    }
});

team.get('/:uuid/projects', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const projects = await database('team_members')
                .innerJoin('team_projects', 'team_members.team_id', 'team_projects.team_id')
                .innerJoin('projects', 'team_projects.project_id', 'projects.id')
                .select({
                    id: 'projects.id',
                    name: 'projects.name',
                    text: 'projects.text',
                    color: 'projects.color',
                    status: 'projects.status',
                    deadline: 'projects.deadline',
                })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'team_members.team_id': id,
                });
            res.status(200).json({
                status: 'success',
                projects: projects,
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get projects',
        });
    }
});

team.get('/:uuid/work', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const since = (req.query.since ?? 0) as number;
            const work = await database({ ut: 'team_members' })
                .innerJoin('team_members', 'ut.team_id', 'team_members.team_id')
                .innerJoin('workhours', 'team_members.user_id', 'workhours.user_id')
                .select({
                    id: 'workhours.id',
                    task: 'workhours.task_id',
                    user: 'workhours.user_id',
                    started: 'workhours.started',
                    finished: 'workhours.finished',
                })
                .where({
                    'ut.user_id': req.body.token.id,
                    'ut.team_id': id,
                })
                .andWhere('workhours.started', '>=', since)
                .groupBy('workhours.id');
            res.status(200).json({
                status: 'success',
                work: work,
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed get work',
        });
    }
});

interface AddRoleBody {
    name: string;
    token: Token;
}

team.post('/:uuid/roles', async (req, res) => {
    if (isOfType<AddRoleBody>(req.body, [['name', 'string']])) {
        try {
            const team_id = req.params.uuid;
            if (validate(team_id)) {
                const team = await database('team_members')
                    .select({ id: 'team_members.team_id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'team_members.team_id': team_id,
                    });
                if (team.length >= 1) {
                    const role_id = uuid();
                    const role_name = req.body.name;
                    await database('roles').insert({
                        id: role_id,
                        name: role_name,
                        team_id: team_id,
                    });
                    res.status(200).json({
                        status: 'success',
                        role: {
                            id: role_id,
                            name: role_name,
                        },
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'team not found',
                    });
                }
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'malformed uuid',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to add role',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

interface UpdateRoleBody {
    name: string;
    token: Token;
}

team.put('/:teamid/roles/:roleid', async (req, res) => {
    if (isOfType<UpdateRoleBody>(req.body, [['name', 'string']])) {
        try {
            const team_id = req.params.teamid;
            const role_id = req.params.roleid;
            if (validate(team_id) && validate(role_id)) {
                const team = await database('team_members')
                    .select({ id: 'team_members.team_id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'team_members.team_id': team_id,
                    });
                if (team.length >= 1) {
                    const role_name = req.body.name;
                    const updated = await database('roles')
                        .update({
                            name: role_name,
                        })
                        .where({
                            id: role_id,
                            team_id: team_id,
                        });
                    if (updated >= 1) {
                        res.status(200).json({
                            status: 'success',
                        });
                    } else {
                        res.status(404).json({
                            status: 'error',
                            message: 'role not found',
                        });
                    }
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'team not found',
                    });
                }
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'malformed uuid',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to update role',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

team.delete('/:teamid/roles/:roleid', async (req, res) => {
    try {
        const team_id = req.params.teamid;
        const role_id = req.params.roleid;
        if (validate(team_id) && validate(role_id)) {
            const team = await database('team_members')
                .select({ id: 'team_members.team_id' })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'team_members.team_id': team_id,
                });
            if (team.length >= 1) {
                const deleted = await database('roles')
                    .delete()
                    .where({
                        id: role_id,
                        team_id: team_id,
                    });
                if (deleted >= 1) {
                    res.status(200).json({
                        status: 'success',
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'role not found',
                    });
                }
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'team not found',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed to delete role',
        });
    }
});

interface AddMemberBody {
    user: string;
    role: string;
    token: Token;
}

team.post('/:uuid/members', async (req, res) => {
    if (isOfType<AddMemberBody>(req.body, [['user', 'string'], ['role', 'string']])) {
        try {
            const team_id = req.params.uuid;
            const user_id = req.body.user;
            const role_id = req.body.role;
            if (validate(team_id) && validate(user_id) && validate(role_id)) {
                const role = await database('team_members')
                    .innerJoin('roles', 'team_members.team_id', 'roles.team_id')
                    .select({ id: 'roles.id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'team_members.team_id': team_id,
                        'roles.id': role_id,
                    });
                if (role.length >= 1) {
                    await database('team_members').insert({
                        user_id: user_id,
                        team_id: team_id,
                        role_id: role_id,
                    });
                    res.status(200).json({
                        status: 'success',
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'role not found',
                    });
                }
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'malformed uuid',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to add member',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

interface UpdateMemberBody {
    user: string;
    role: string;
    token: Token;
}

team.put('/:uuid/members', async (req, res) => {
    if (isOfType<UpdateMemberBody>(req.body, [['user', 'string'], ['role', 'string']])) {
        try {
            const team_id = req.params.uuid;
            const user_id = req.body.user;
            const role_id = req.body.role;
            if (validate(team_id) && validate(user_id) && validate(role_id)) {
                const role = await database('team_members')
                    .innerJoin('roles', 'team_members.team_id', 'roles.team_id')
                    .select({ id: 'roles.id' })
                    .where({
                        'team_members.user_id': req.body.token.id,
                        'team_members.team_id': team_id,
                        'roles.id': role_id,
                    });
                if (role.length >= 1) {
                    await database('team_members')
                    .update({ role_id: role_id })
                    .where({
                        user_id: user_id,
                        team_id: team_id,
                    });
                    res.status(200).json({
                        status: 'success',
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'role not found',
                    });
                }
            } else {
                res.status(400).json({
                    status: 'error',
                    message: 'malformed uuid',
                });
            }
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'failed to update member',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

team.delete('/:teamid/members/:userid', async (req, res) => {
    try {
        const team_id = req.params.teamid;
        const user_id = req.params.userid;
        if (validate(team_id) && validate(user_id)) {
            const team = await database('team_members')
                .select({ id: 'team_members.team_id' })
                .where({
                    'team_members.user_id': req.body.token.id,
                    'team_members.team_id': team_id,
                });
            if (team.length >= 1) {
                const deleted = await database('team_members')
                    .delete()
                    .where({
                        'team_members.user_id': user_id,
                        'team_members.team_id': team_id,
                    });
                if (deleted >= 1) {
                    res.status(200).json({
                        status: 'success',
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'role not found',
                    });
                }
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'team not found',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed remove members',
        });
    }
});

team.delete('/:uuid/', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const deleted = await database('team_members')
                .delete()
                .where({
                    'team_members.user_id': req.body.token.id,
                    'team_members.team_id': id,
                });
            if (deleted >= 1) {
                res.status(200).json({
                    status: 'success',
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'team not found',
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'malformed uuid',
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'error',
            message: 'failed leave team',
        });
    }
});

export default team;

