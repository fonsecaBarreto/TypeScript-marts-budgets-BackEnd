const { cnpj } = require('cpf-cnpj-validator')
const faker  = require('faker')

const createAddress = (id) =>({
    id,
    address: faker.address.streetAddress(),
    address_region: faker.address.county(),
    address_number: Math.ceil(Math.random() * 200),
    address_postalcode: faker.address.zipCode(),
    address_city: faker.address.cityName(),
    uf: "RJ",
    details: ""
})

const createFakeProviders = ({ id, address_id }) => ({

    id,
    name: faker.company.companySuffix(),
    email: faker.internet.email(),
    phone: (faker.phone.phoneNumber()).replace(/[^\d]+/g,''),
    cnpj: (cnpj.generate()).replace(/[^\d]+/g,''),
    corporate_name: faker.company.companyName(),
    obs: "Observação sobre a empresa",
    address_id,
    financial_email:  faker.internet.email(),
    responsible_name: faker.name.firstName()+ " " + faker.name.lastName(),

})


exports.seed = async function(knex) {

  await knex('providers').del()
  
  await knex('addresses').insert([createAddress('address_provider_00')]);
  await knex('providers').insert([createFakeProviders({ id: 'provider_00', address_id: 'address_provider_00'})]);

 
};


