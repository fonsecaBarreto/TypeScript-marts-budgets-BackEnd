

exports.up = function(knex) {
    return knex.schema.createTable('categories', t =>{
        t.string('id').primary()
        t.string('name').notNull()
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
    .createTable('products', t =>{
        t.string('id').primary()
        t.text('description','longtext').notNull()
        t.string('presentation')
        t.string('brand')
        t.string('provider')
        t.integer('stock').default(0)
        t.string('category_id').references('categories.id').onDelete('SET NULL');
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
    
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("products").dropTable('categories')
};
  