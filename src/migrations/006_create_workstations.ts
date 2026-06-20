import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('workstations', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable();
    table.timestamps(true, true);
    table.uuid('barbershopId').notNullable().references('id').inTable('barbershops').onDelete('CASCADE');
    table.uuid('ownerId').notNullable().references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('workstations');
}
