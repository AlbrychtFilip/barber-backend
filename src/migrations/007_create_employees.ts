import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('employees', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable();
    table.string('surname').notNullable();
    table.string('email').notNullable();
    table.string('phoneNumber').notNullable();
    table.uuid('barbershopId').notNullable().references('id').inTable('barbershops').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('employees');
}
