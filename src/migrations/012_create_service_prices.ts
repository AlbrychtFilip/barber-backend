import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('servicePrices', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.decimal('price', 10, 2).notNullable();
    table.enum('currency', ['USD', 'PLN', 'EUR']).notNullable().defaultTo('PLN');
    table.uuid('serviceId').notNullable().references('id').inTable('services').onDelete('CASCADE');
    table.uuid('barbershopId').notNullable().references('id').inTable('barbershops').onDelete('CASCADE');
    table.uuid('employeeId').notNullable().references('id').inTable('employees').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('servicePrices');
}
