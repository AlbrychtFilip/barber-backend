import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('categories', (table) => {
    table.string('photo').nullable().alter();
  });

  await knex.schema.alterTable('inventory', (table) => {
    table.string('photo').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('categories', (table) => {
    table.string('photo').notNullable().alter();
  });

  await knex.schema.alterTable('inventory', (table) => {
    table.string('photo').notNullable().alter();
  });
}
