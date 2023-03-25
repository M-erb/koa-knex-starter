/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary()
      table.string('firstName', 255)
      table.string('lastName', 255)
      table.string('email', 255).unique()
      table.string('password', 255)
      table.boolean('active')
      table.json('settings')
      table.timestamps(false, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex) {
  return knex.schema.dropTable('users')
}
