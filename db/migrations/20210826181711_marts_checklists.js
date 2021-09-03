
exports.up = function(knex) {
    return knex.schema.createTable('marts_checklists', t =>{
        t.string('mart_id').primary().unique().references('marts.id').onDelete('CASCADE');
        t.integer('access_number').notNull().default(0)
        t.boolean('first_rating').notNull().default(false)
        t.boolean('first_suggestions').notNull().default(false)
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
  };
  
exports.down = function(knex) {
return knex.schema.dropTable('marts_checklists')
};
