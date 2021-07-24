exports.up = function(knex) {
    return knex.schema.createTable('marts', t =>{
        t.string('id').primary()
        t.string('name').notNull()
        t.string('email').notNull().unique()
        t.string('cnpj_cpf').notNull().unique()
        t.string('password').notNull()
        t.string('phone').unique()
        t.string('annex')
        t.string('image')
        t.boolean('transfer_allowed').default(false)
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('marts')
  };
  