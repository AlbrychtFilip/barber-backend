import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('inventory', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.decimal('price', 10, 2).nullable();
    table.string('photo').notNullable();
    table.integer('count').notNullable().defaultTo(0);
    table.timestamps(true, true);
    table.uuid('categoryId').notNullable().references('id').inTable('categories').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('inventory');
}
