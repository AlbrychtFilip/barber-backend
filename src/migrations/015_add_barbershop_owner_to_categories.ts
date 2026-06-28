import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('categories', (table) => {
    table.uuid('barbershopId').nullable().references('id').inTable('barbershops').onDelete('SET NULL');
    table.uuid('ownerId').nullable().references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('categories', (table) => {
    table.dropColumn('barbershopId');
    table.dropColumn('ownerId');
  });
}
