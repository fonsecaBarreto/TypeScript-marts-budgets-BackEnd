
exports.up = function(knex) {
    return knex.schema.createTable('suggestions', t =>{
        t.string('id').primary()
        t.string('mart_id').references('marts.id').onDelete('CASCADE');
        t.json('items').notNull()
        t.timestamp('created_at').default(knex.fn.now())
        t.timestamp('updated_at').default(knex.fn.now())
    })
  };
  
exports.down = function(knex) {
return knex.schema.dropTable('suggestions')
};

