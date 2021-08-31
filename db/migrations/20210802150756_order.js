
exports.up = function(knex) {
    return knex.schema.createTable('orders', t =>{
        t.string('id').primary()
        t.integer('os').unique().notNull()
        t.integer('quantity').default(0)
        t.timestamp('forecast').notNull()
        t.string('product_id').references("products.id").notNull().onDelete('CASCADE');
        t.string('mart_id').references("marts.id").notNull().onDelete('CASCADE');
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders')
};
