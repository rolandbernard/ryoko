
import { Knex } from "knex";

export async function up(database: Knex): Promise<void> {
    return database.schema
        .createTable('users', table => {
            table.uuid('id').notNullable().primary();
            table.string('user_name').unique().notNullable();
            table.string('passwd_hash', 60).notNullable();
            table.text('email');
            table.text('real_name');
            table.binary('image');
        })
        .createTable('teams', table => {
            table.uuid('id').notNullable().primary();
            table.text('name').notNullable();
        })
        .createTable('team_members', table => {
            table.uuid('user_id').notNullable().references('users.id');
            table.uuid('team_id').notNullable().references('teams.id');
            table.primary(['user_id', 'team_id']);
            table.uuid('role_id').notNullable().references('roles.id');
        })
        .createTable('roles', table => {
            table.uuid('id').notNullable().primary();
            table.uuid('team_id').notNullable().references('teams.id');
            table.text('name').notNullable();
        })
        .createTable('projects', table => {
            table.uuid('id').notNullable().primary();
            table.text('name').notNullable();
            table.text('text').notNullable();
            table.string('color').notNullable();
            table.enum('status', [ 'open', 'closed', 'suspended' ]).notNullable();
            table.date('deadline');
        })
        .createTable('team_projects', table => {
            table.uuid('project_id').notNullable().references('projects.id');
            table.uuid('team_id').notNullable().references('teams.id');
            table.primary(['project_id', 'team_id']);
        })
        .createTable('tasks', table => {
            table.uuid('id').notNullable().primary();
            table.uuid('project_id').notNullable().references('projects.id');
            table.text('name').notNullable();
            table.text('text').notNullable();
            table.string('icon').notNullable();
            table.enum('status', [ 'open', 'closed', 'suspended' ]).notNullable();
            table.enum('priority', [ 'low', 'medium', 'high', 'urgent' ]).notNullable();
            table.timestamp('created').notNullable();
            table.timestamp('edited').notNullable();
        })
        .createTable('task_dependencies', table => {
            table.uuid('task_id').notNullable().references('tasks.id');
            table.uuid('requires_id').notNullable().references('tasks.id');
            table.primary(['task_id', 'requires_id']);
        })
        .createTable('task_requirements', table => {
            table.uuid('task_id').notNullable().references('tasks.id');
            table.uuid('role_id').notNullable().references('roles.id');
            table.primary(['task_id', 'role_id']);
            table.integer('time').notNullable();
        })
        .createTable('task_assignees', table => {
            table.uuid('user_id').notNullable().references('users.id');
            table.uuid('task_id').notNullable().references('tasks.id');
            table.primary(['user_id', 'task_id']);
            table.integer('time').notNullable();
            table.boolean('finished').notNullable();
        })
        .createTable('comments', table => {
            table.uuid('id').notNullable().primary();
            table.uuid('task_id').notNullable().references('tasks.id');
            table.uuid('user_id').notNullable().references('users.id');
            table.text('text').notNullable();
            table.timestamp('created').notNullable();
            table.timestamp('edited').notNullable();
        })
        .createTable('workhours', table => {
            table.uuid('id').notNullable().primary();
            table.uuid('user_id').notNullable().references('users.id');
            table.uuid('task_id').notNullable().references('tasks.id');
            table.timestamp('started').notNullable();
            table.timestamp('finished');
        });
}

export async function down(database: Knex): Promise<void> {
    return database.schema
        .dropTable('comments')
        .dropTable('task_assignees')
        .dropTable('task_requirements')
        .dropTable('tasks')
        .dropTable('team_projects')
        .dropTable('projects')
        .dropTable('roles')
        .dropTable('team_members')
        .dropTable('teams')
        .dropTable('users')
        .dropTable('workhours');
}

