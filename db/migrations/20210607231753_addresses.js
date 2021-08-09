
exports.up = function(knex) {
    return knex.schema.createTable('addresses', t =>{
        t.string('id').primary()
        t.string('address').notNull()
        t.string('address_region').notNull()
        t.string('address_number').notNull()
        t.string('address_postalcode').notNull()
        t.string('address_city').notNull()
        t.string('uf').notNull()
        t.text('details')
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('addresses')
};
