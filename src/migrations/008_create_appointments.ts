import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('appointments', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('clientName').notNullable();
    table.string('clientEmail').nullable();
    table.string('clientPhoneNumber').notNullable();
    table.timestamp('startTime').notNullable();
    table.integer('duration').notNullable();
    table.enum('status', ['scheduled', 'completed', 'cancelled']).notNullable().defaultTo('scheduled');
    table.uuid('employeeId').notNullable().references('id').inTable('employees').onDelete('CASCADE');
    table.uuid('workstationId').notNullable().references('id').inTable('workstations').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('appointments');
}
