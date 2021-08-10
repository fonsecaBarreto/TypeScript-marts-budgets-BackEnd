
exports.up = function(knex) {
    return knex.schema.createTable('mart_annexs', t =>{
        t.string('id').primary()
        t.string('name').notNull()
        t.string('contentType').notNull()
        t.string('mart_id').notNull().references('marts.id').onDelete('CASCADE');
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('mart_annexs')
  };
  