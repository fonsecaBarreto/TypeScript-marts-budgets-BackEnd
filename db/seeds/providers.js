const { cnpj } = require('cpf-cnpj-validator')
const faker  = require('faker')

const createAddress = (i) =>({
    id: 'provider_address_test_ID_'+i, 
    address: faker.address.streetAddress(),
    address_region: faker.address.county(),
    address_number: Math.ceil(Math.random() * 200),
    address_postalcode: faker.address.zipCode(),
    address_city: faker.address.cityName(),
    uf: "RJ",
    details: ""
})

const createFakeProviders = (i) => ({

    id: "test_ID_0"+i,
    name: faker.company.companySuffix(),
    email: faker.internet.email(),
    phone: (faker.phone.phoneNumber()).replace(/[^\d]+/g,''),
    cnpj: (cnpj.generate()).replace(/[^\d]+/g,''),
    corporate_name: faker.company.companyName(),
    obs: "Observação sobre a empresa",

    address_id:`provider_address_test_ID_${i}`,
    financial_email:  faker.internet.email(),
    responsible_name: faker.name.firstName()+ " " + faker.name.lastName(),

})


exports.seed = async function(knex) {

  const total = 10
  const addresses = []
  const providers = []
  for(let i = 1; i < total; i ++ ){
    addresses.push(createAddress(i))
    providers.push(createFakeProviders(i))
  }

  await knex('providers').del()

  await knex('addresses').insert(addresses);
  await knex('providers').insert(providers);

 
};


