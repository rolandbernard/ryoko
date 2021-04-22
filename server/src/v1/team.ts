
import express from 'express';
import { v4 as uuid, validate } from 'uuid';

import database from '../database';
import { requireVerification, Token } from './auth';
import { isOfType } from '../util';

const team = express();

team.use(requireVerification);

interface TeamCreateBody {
    name: string;
    token: Token;
}

team.post('/', async (req, res) => {
    if (isOfType<TeamCreateBody>(req.body, [['name', 'string']])) {
        const team_id = uuid();
        const team_name = req.body.name.trim();
        const role_id = uuid();
        if (team_name.length >= 4) {
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
                message: 'team names must be four letters or longer',
            });
        }
    } else {
        res.status(400).json({
            status: 'error',
            message: 'missing request fields',
        });
    }
});

team.get('/:uuid/', async (req, res) => {
    try {
        const id = req.params.uuid;
        if (validate(id)) {
            const team = await database('users')
                .innerJoin('team_members', 'users.id', 'team_members.user_id')
                .innerJoin('teams', 'team_members.team_id', 'teams.id')
                .select({
                    id: 'teams.id',
                    name: 'teams.name',
                })
                .where({
                    'users.id': req.body.token.id,
                    'teams.id': id,
                });
            if (team.length === 1) {
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
            const members = await database({ user: 'users' })
                .innerJoin({ ut: 'team_members'}, 'user.id', 'ut.user_id')
                .innerJoin({ tm: 'team_members'}, 'ut.team_id', 'tm.team_id')
                .innerJoin({ members: 'users'}, 'tm.user_id', 'members.id')
                .select({
                    id: 'members.id',
                    name: 'members.user_name',
                    email: 'members.email',
                    realname: 'members.real_name',
                })
                .where({
                    'user.id': req.body.token.id,
                    'ut.team_id': id,
                });
            if (members.length >= 1) {
                res.status(200).json({
                    status: 'success',
                    members: members,
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

export default team;

