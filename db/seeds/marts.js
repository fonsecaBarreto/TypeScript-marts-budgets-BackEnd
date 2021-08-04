
const { hashSync } = require('bcryptjs')
const faker  = require('faker')
const { cnpj } = require('cpf-cnpj-validator')

const createFakeMart = (i) =>({
  id: 'mart_test_ID_0'+i, 
  name: faker.company.companyName(),
  email: faker.internet.email(),
  phone: (faker.phone.phoneNumber()).replace(/[^\d]+/g,''),
  cnpj_cpf: (cnpj.generate()).replace(/[^\d]+/g,''),
  password: Math.random() > 0.5 ? hashSync('123456') : null,
  annex: null,
  transfer_allowed: Math.random() > 0.5 ? true : false,
  image: null
})

exports.seed = async function(knex) {

  const fakers = []
  for(let i = 1; i < 9; i ++ ){
    fakers.push(createFakeMart(i))
  }
  await knex('marts').del()

      // Inserts seed entries
  await knex('marts').insert([
        { 
          id: 'mart_00', 
          name: 'Mercado Teste', 
          password: hashSync('123456'),
          email: "emailtest@mail.com",
          phone: "2134567892",
          cnpj_cpf: "16684653216687",
          annex: null,
          transfer_allowed: true,
          image: null
        }, ...fakers
        
      ]);
   
};


