import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('usedInventory', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('inventoryId').notNullable().references('id').inTable('inventory').onDelete('CASCADE');
    table.integer('count').notNullable().defaultTo(0);
    table.string('comment', 255).nullable();
    table.timestamp('usedAt').notNullable().defaultTo(knex.fn.now());
    table.enum('useType', ['SOLD', 'USED', 'OTHER']).notNullable().defaultTo('USED');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('usedInventory');
}
