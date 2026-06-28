import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('appointments', (table) => {
    table.dropColumn('duration');
    table.uuid('serviceId').notNullable().references('id').inTable('services').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('appointments', (table) => {
    table.dropColumn('serviceId');
    table.integer('duration').notNullable().defaultTo(0);
  });
}
