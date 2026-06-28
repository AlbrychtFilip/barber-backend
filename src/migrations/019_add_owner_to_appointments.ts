import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('appointments', (table) => {
    table.uuid('ownerId').nullable().references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('appointments', (table) => {
    table.dropColumn('ownerId');
  });
}
