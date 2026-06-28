import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('services', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name', 255).notNullable();
    table.uuid('barbershopId').notNullable().references('id').inTable('barbershops').onDelete('CASCADE');
    table.integer('serviceTime').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('services');
}
