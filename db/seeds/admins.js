const { hashSync } = require('bcryptjs')
exports.seed = function(knex) {
  return knex('admins').del()
    .then(function () {
      return knex('admins').insert([ {id: 'admin_01', username: 'admin', password: hashSync('123456')} ]);
    });
};
