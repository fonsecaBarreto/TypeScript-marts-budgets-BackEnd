
const { hashSync } = require('bcryptjs')
const faker  = require('faker')
const { cnpj } = require('cpf-cnpj-validator')

const createFakeMart = (i) =>({
  id: 'mart_test_0'+i, 
  name: faker.company.companyName(),
  password: hashSync('123456'),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  cnpj_cpf: cnpj.generate()
})

exports.seed = async function(knex) {

  const fakers = []
  for(let i = 1; i < 20; i ++ ){
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
          cnpj_cpf: "16684653216687"
        }, ...fakers
        
      ]);
   
};


