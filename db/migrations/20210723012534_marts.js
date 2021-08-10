exports.up = function(knex) {
    return knex.schema.createTable('marts', t =>{
        t.string('id').primary()
        t.string('name').notNull()
        t.string('email').notNull().unique()
        t.string('cnpj_cpf').notNull().unique()
        t.string('password')
        t.string('phone').unique()
        t.string('image')
        t.boolean('transfer_allowed').default(false)
  
        t.string("responsible_name").notNull()
        t.string("financial_email").unique()
        t.string("corporate_name").unique()
        t.string('address_id').references('addresses.id').onDelete('SET NULL');
        t.text('obs','longtext')

        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('marts')
  };
  