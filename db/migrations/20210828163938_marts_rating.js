
exports.up = function(knex) {
    return knex.schema.createTable('marts_rating', t =>{
        t.string('id').primary()
        t.string('mart_id').references('marts.id').onDelete('CASCADE');
        t.integer('grade').notNull().default(0)
        t.text('description')
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
  };
  
exports.down = function(knex) {
return knex.schema.dropTable('marts_rating')
};

