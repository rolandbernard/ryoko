
import { env } from 'process';

import { database, migrate, close } from './database';

async function loadTestData() {
    await database('users')
        .insert([
            {
                id: '00000000-0000-4000-8000-000000000000',
                user_name: 'user0',
                passwd_hash: '$2b$10$sjHhJNz4sLNclKEwWISZRe4cVju6jn4QjMVs4wdZ6wug2SKG774pq',
                email: 'test0@example.com',
                real_name: 'Testing Tester',
                image: null,
            }, {
                id: '00000000-0000-4000-8000-000000000001',
                user_name: 'user1',
                passwd_hash: '$2b$10$sjHhJNz4sLNclKEwWISZRe4cVju6jn4QjMVs4wdZ6wug2SKG774pq',
                email: 'test1@example.com',
                real_name: 'Tester Testing',
                image: Buffer.from('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', 'base64'),
            }
        ]);
    await database('teams')
        .insert([
            {
                id: '00000000-0000-4000-8000-000000000000',
                name: 'Team0',
            }, {
                id: '00000000-0000-4000-8000-000000000001',
                name: 'Team1',
            }, {
                id: '00000000-0000-4000-8000-000000000002',
                name: 'Team2',
            }
        ]);
    await database('roles')
        .insert([
            {
                id: '00000000-0000-4000-8000-000000000000',
                team_id: '00000000-0000-4000-8000-000000000000',
                name: 'Role0',
            }, {
                id: '00000000-0000-4000-8000-000000000001',
                team_id: '00000000-0000-4000-8000-000000000001',
                name: 'Role1',
            }, {
                id: '00000000-0000-4000-8000-000000000002',
                team_id: '00000000-0000-4000-8000-000000000002',
                name: 'Role2',
            }, {
                id: '00000000-0000-4000-8000-000000000003',
                team_id: '00000000-0000-4000-8000-000000000002',
                name: 'Role3',
            }
        ]);
    await database('team_members')
        .insert([
            {
                user_id: '00000000-0000-4000-8000-000000000000',
                team_id:  '00000000-0000-4000-8000-000000000000',
                role_id:  '00000000-0000-4000-8000-000000000000',
            }, {
                user_id: '00000000-0000-4000-8000-000000000001',
                team_id:  '00000000-0000-4000-8000-000000000001',
                role_id:  '00000000-0000-4000-8000-000000000001',
            }, {
                user_id: '00000000-0000-4000-8000-000000000000',
                team_id:  '00000000-0000-4000-8000-000000000002',
                role_id:  '00000000-0000-4000-8000-000000000002',
            }, {
                user_id: '00000000-0000-4000-8000-000000000001',
                team_id:  '00000000-0000-4000-8000-000000000002',
                role_id:  '00000000-0000-4000-8000-000000000003',
            }
        ]);
    await database('projects')
        .insert([
            {
                id: '00000000-0000-4000-8000-000000000000',
                name: 'Project0',
                text: 'Project0 Text',
                color: '#00f',
                status: 'open',
                deadline: '2020-10-10',
            }, {
                id: '00000000-0000-4000-8000-000000000001',
                name: 'Project1',
                text: 'Project1 Text',
                color: '#0f0',
                status: 'closed',
                deadline: null,
            }, {
                id: '00000000-0000-4000-8000-000000000002',
                name: 'Project2',
                text: 'Project2 Text',
                color: '#f00',
                status: 'suspended',
                deadline: null,
            }
        ]);
    await database('team_projects')
        .insert([
            {
                project_id: '00000000-0000-4000-8000-000000000000',
                team_id: '00000000-0000-4000-8000-000000000000',
            }, {
                project_id: '00000000-0000-4000-8000-000000000001',
                team_id: '00000000-0000-4000-8000-000000000002',
            }, {
                project_id: '00000000-0000-4000-8000-000000000002',
                team_id: '00000000-0000-4000-8000-000000000000',
            }, {
                project_id: '00000000-0000-4000-8000-000000000002',
                team_id: '00000000-0000-4000-8000-000000000001',
            }
        ]);
    await database('tasks')
        .insert([
            {
                id: '00000000-0000-4000-8000-000000000000',
                project_id: '00000000-0000-4000-8000-000000000000',
                name: 'Task0',
                text: 'Task0 Text',
                icon: '0',
                status: 'open',
                priority: 'medium',
                created: Date.parse('2020-10-05'),
                edited: Date.parse('2020-10-10'),
            }, {
                id: '00000000-0000-4000-8000-000000000001',
                project_id: '00000000-0000-4000-8000-000000000001',
                name: 'Task1',
                text: 'Task1 Text',
                icon: '1',
                status: 'closed',
                priority: 'high',
                created: Date.parse('2020-10-10'),
                edited: Date.parse('2020-10-15'),
            }, {
                id: '00000000-0000-4000-8000-000000000002',
                project_id: '00000000-0000-4000-8000-000000000002',
                name: 'Task2',
                text: 'Task2 Text',
                icon: '2',
                status: 'open',
                priority: 'low',
                created: Date.parse('2020-10-15'),
                edited: Date.parse('2020-10-20'),
            }, {
                id: '00000000-0000-4000-8000-000000000003',
                project_id: '00000000-0000-4000-8000-000000000002',
                name: 'Task3',
                text: 'Task3 Text',
                icon: '3',
                status: 'closed',
                priority: 'urgent',
                created: Date.parse('2020-10-15'),
                edited: Date.parse('2020-10-20'),
            }, {
                id: '00000000-0000-4000-8000-000000000004',
                project_id: '00000000-0000-4000-8000-000000000002',
                name: 'Task4',
                text: 'Task4 Text',
                icon: '4',
                status: 'suspended',
                priority: 'urgent',
                created: Date.parse('2020-10-15'),
                edited: Date.parse('2020-10-20'),
            }, {
                id: '00000000-0000-4000-8000-000000000005',
                project_id: '00000000-0000-4000-8000-000000000002',
                name: 'Task5',
                text: 'Task5 Text',
                icon: '5',
                status: 'open',
                priority: 'urgent',
                created: Date.parse('2020-10-15'),
                edited: Date.parse('2020-11-20'),
            }
        ]);
    await database('task_requirements')
        .insert([
            {
                task_id: '00000000-0000-4000-8000-000000000000',
                role_id: '00000000-0000-4000-8000-000000000000',
                time: 30,
            }, {
                task_id: '00000000-0000-4000-8000-000000000001',
                role_id: '00000000-0000-4000-8000-000000000001',
                time: 30,
            }, {
                task_id: '00000000-0000-4000-8000-000000000005',
                role_id: '00000000-0000-4000-8000-000000000000',
                time: 60,
            }, {
                task_id: '00000000-0000-4000-8000-000000000005',
                role_id: '00000000-0000-4000-8000-000000000001',
                time: 30,
            }
        ]);
    await database('task_dependencies')
        .insert([
            {
                task_id: '00000000-0000-4000-8000-000000000002',
                requires_id: '00000000-0000-4000-8000-000000000005',
            }
        ]);
    await database('task_assignees')
        .insert([
            {
                task_id: '00000000-0000-4000-8000-000000000005',
                user_id: '00000000-0000-4000-8000-000000000000',
                time: 120,
                finished: false,
            }
        ]);
    await database('workhours')
        .insert([
            {
                id: '00000000-0000-4000-8000-000000000000',
                task_id: '00000000-0000-4000-8000-000000000005',
                user_id: '00000000-0000-4000-8000-000000000000',
                started: Date.parse('2020-10-10T12:00:00'),
                finished: Date.parse('2020-10-10T13:00:00'),
            }, {
                id: '00000000-0000-4000-8000-000000000001',
                task_id: '00000000-0000-4000-8000-000000000005',
                user_id: '00000000-0000-4000-8000-000000000000',
                started: Date.parse('2020-10-10T13:00:00'),
                finished: Date.parse('2020-10-10T14:00:00'),
            }, {
                id: '00000000-0000-4000-8000-000000000002',
                task_id: '00000000-0000-4000-8000-000000000005',
                user_id: '00000000-0000-4000-8000-000000000000',
                started: Date.parse('2020-10-11T12:00:00'),
                finished: null,
            }
        ]);
    await database('comments')
        .insert([
            {
                id: '00000000-0000-4000-8000-000000000000',
                task_id: '00000000-0000-4000-8000-000000000005',
                user_id: '00000000-0000-4000-8000-000000000000',
                text: 'Comment0',
                created: Date.parse('2020-10-10T00:00:00'),
                edited: Date.parse('2020-10-10T01:00:00'),
            }, {
                id: '00000000-0000-4000-8000-000000000001',
                task_id: '00000000-0000-4000-8000-000000000005',
                user_id: '00000000-0000-4000-8000-000000000001',
                text: 'Comment1',
                created: Date.parse('2020-10-10T03:00:00'),
                edited: Date.parse('2020-10-10T04:00:00'),
            }, {
                id: '00000000-0000-4000-8000-000000000002',
                task_id: '00000000-0000-4000-8000-000000000005',
                user_id: '00000000-0000-4000-8000-000000000001',
                text: 'Comment2',
                created: Date.parse('2020-10-10T05:00:00'),
                edited: Date.parse('2020-10-10T05:00:00'),
            }
        ]);
}

async function deleteTestData() {
    if (env.NODE_ENV !== 'test') {
        await database('comments')
            .delete()
            .whereIn('comments.task_id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
                '00000000-0000-4000-8000-000000000003',
                '00000000-0000-4000-8000-000000000004',
                '00000000-0000-4000-8000-000000000005',
            ]);
        await database('workhours')
            .delete()
            .whereIn('workhours.task_id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
                '00000000-0000-4000-8000-000000000003',
                '00000000-0000-4000-8000-000000000004',
                '00000000-0000-4000-8000-000000000005',
            ]);
        await database('task_assignees')
            .delete()
            .whereIn('task_assignees.task_id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
                '00000000-0000-4000-8000-000000000003',
                '00000000-0000-4000-8000-000000000004',
                '00000000-0000-4000-8000-000000000005',
            ]);
        await database('task_dependencies')
            .delete()
            .whereIn('task_dependencies.task_id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
                '00000000-0000-4000-8000-000000000003',
                '00000000-0000-4000-8000-000000000004',
                '00000000-0000-4000-8000-000000000005',
            ]);
        await database('task_requirements')
            .delete()
            .whereIn('task_requirements.task_id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
                '00000000-0000-4000-8000-000000000003',
                '00000000-0000-4000-8000-000000000004',
                '00000000-0000-4000-8000-000000000005',
            ]);
        await database('tasks')
            .delete()
            .whereIn('tasks.id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
                '00000000-0000-4000-8000-000000000003',
                '00000000-0000-4000-8000-000000000004',
                '00000000-0000-4000-8000-000000000005',
            ]);
        await database('team_projects')
            .delete()
            .whereIn('team_projects.team_id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
            ]);
        await database('projects')
            .delete()
            .whereIn('projects.id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
            ]);
        await database('team_members')
            .delete()
            .whereIn('team_members.user_id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
            ]);
        await database('roles')
            .delete()
            .whereIn('roles.id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
                '00000000-0000-4000-8000-000000000003',
            ]);
        await database('teams')
            .delete()
            .whereIn('teams.id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
                '00000000-0000-4000-8000-000000000002',
            ]);
        await database('users')
            .delete()
            .whereIn('users.id', [
                '00000000-0000-4000-8000-000000000000',
                '00000000-0000-4000-8000-000000000001',
            ]);
    } else {
        // The test database is in memory only and does not have to be cleaned
    }
}

beforeAll(async () => {
    await migrate();
    await loadTestData();
});

afterAll(async () => {
    await deleteTestData();
    await close();
});

