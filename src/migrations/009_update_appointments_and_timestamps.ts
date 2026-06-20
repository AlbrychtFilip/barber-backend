import { Knex } from 'knex';

const tablesWithTimestamps = [
  'users',
  'barbershops',
  'categories',
  'inventory',
  'workstations',
  'employees',
  'appointments',
];

export async function up(knex: Knex): Promise<void> {
  for (const table of tablesWithTimestamps) {
    await knex.schema.raw(
      `ALTER TABLE "${table}" ALTER COLUMN "created_at" TYPE timestamp, ALTER COLUMN "updated_at" TYPE timestamp`
    );
  }

  await knex.schema.raw(
    `ALTER TABLE "appointments" ALTER COLUMN "startTime" TYPE timestamp`
  );

  await knex.schema.alterTable('appointments', (table) => {
    table.boolean('initialNotificationSent').notNullable().defaultTo(false);
    table.boolean('reminderNotificationSent').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('appointments', (table) => {
    table.dropColumn('initialNotificationSent');
    table.dropColumn('reminderNotificationSent');
  });

  for (const table of tablesWithTimestamps) {
    await knex.schema.raw(
      `ALTER TABLE "${table}" ALTER COLUMN "created_at" TYPE timestamptz, ALTER COLUMN "updated_at" TYPE timestamptz`
    );
  }

  await knex.schema.raw(
    `ALTER TABLE "appointments" ALTER COLUMN "startTime" TYPE timestamptz`
  );
}
