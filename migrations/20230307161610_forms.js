/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
  return knex.schema
    .createTable('forms', function (table) {
      table.increments('id').primary()
      table.string('uuid', 255).unique()
      table.string('name', 255)
      table.string('description', 400)
      table.string('path', 255).unique()
      table.string('captcha_key', 350)
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
  return knex.schema.dropTable('forms')
}
