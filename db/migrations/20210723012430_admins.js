
exports.up = function(knex) {
    return knex.schema.createTable('admins', t =>{
        t.string('id').primary()
        t.string('username').notNull()
        t.string('password').notNull()
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('admins')
  };
  