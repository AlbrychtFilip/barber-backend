import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('subcategories', (table) => {
    table.uuid('categoryId').notNullable().references('id').inTable('categories').onDelete('CASCADE');
    table.uuid('subcategoryId').notNullable().references('id').inTable('categories').onDelete('CASCADE');
    table.primary(['categoryId', 'subcategoryId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('subcategories');
}
