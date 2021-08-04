

exports.up = function(knex) {
    return knex.schema.createTable('categories', t =>{
        t.string('id').primary()
        t.string('name').notNull()
        t.string('category_id').references('categories.id').onDelete('SET NULL')
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
    .createTable('providers', t => {
        t.string('id').primary()
        t.string('name').notNull()
        t.string('phone').unique()
        t.string('email').notNull().unique()

        t.string('cnpj').unique().notNull()
        t.string('corporate_name').unique().notNull()
        t.text('obs','longtext')
  
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
    .createTable('brands', t => {
        t.string('id').primary()
        t.string('name').notNull()
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
    .createTable('products', t =>{
        t.string('id').primary()
        t.text('description','longtext').notNull()
        t.string('presentation')
        t.integer('stock').default(0)
        t.float('price').default(0)
        t.string('ncm').unique()
        t.string('ean').unique()
        t.string('sku').unique()
        t.string('image')
        t.string('brand_id').references('brands.id').onDelete('SET NULL');
        t.string('category_id').references('categories.id').onDelete('SET NULL');
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
    
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("products").dropTable("providers").dropTable("brands").dropTable('categories')
};
  