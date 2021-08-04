const { cnpj } = require('cpf-cnpj-validator')
const faker  = require('faker')

const createFakeProviders = async (knex) => {

  const total = 10
  const create = (i) =>({
    id: "test_ID_0"+i,
    name: faker.company.companySuffix(),
    email: faker.internet.email(),
    phone: (faker.phone.phoneNumber()).replace(/[^\d]+/g,''),
    cnpj: (cnpj.generate()).replace(/[^\d]+/g,''),
    corporate_name: faker.company.companyName(),
    obs: "Observação sobre a empresa"
  })


  const providers = []
  for(let i = 0; i < total; i ++ ){
    providers.push(create(i))
  }
  await knex('providers').del()
  await knex('providers').insert(providers);
} 


exports.seed = async function(knex) {

  await createFakeProviders(knex)  
 
};


