import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('barbershops', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').unique().notNullable();
    table.string('address').notNullable();
    table.string('phoneNumber').notNullable();
    table.timestamps(true, true);
    table.uuid('ownerId').notNullable().references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('barbershops');
}
