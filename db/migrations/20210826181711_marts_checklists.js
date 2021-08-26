
exports.up = function(knex) {
    return knex.schema.createTable('marts_checklists', t =>{
        t.string('mart_id').primary().unique().references('marts.id').onDelete('CASCADE');
        t.boolean('access_number').notNull().default(0)
        t.boolean('first_suggestions').notNull().default(false)
    })
  };
  
exports.down = function(knex) {
return knex.schema.dropTable('marts_checklists')
};
