
const { hashSync } = require('bcryptjs')
const faker  = require('faker')
const { cnpj } = require('cpf-cnpj-validator')

const createAddress = (i) =>{
  return (
  {
    id: 'address_test_ID_'+i, 
    address: faker.address.streetAddress(),
    address_region: faker.address.county(),
    address_number: faker.address.streetSuffix(),
    address_postalcode: faker.address.zipCode(),
    address_city: faker.address.cityName(),
    uf: faker.address.state(),
    details: ""
  })
  
}
const createFakeMart = (i) =>({
  id: 'mart_test_ID_0'+i, 
  name: faker.company.companyName(),
  email: faker.internet.email(),
  phone: (faker.phone.phoneNumber()).replace(/[^\d]+/g,''),
  cnpj_cpf: (cnpj.generate()).replace(/[^\d]+/g,''),
  password: Math.random() > 0.5 ? hashSync('123456') : null,
  annex: null,
  transfer_allowed: Math.random() > 0.5 ? true : false,
  image: null,

  financial_email: faker.internet.email(),
  responsible_name:"Nome Teste ",
  corporate_name: faker.company.companyName(),
  address_id: `address_test_ID_${i}`
})

exports.seed = async function(knex) {

  const fakers = []
  const addresses = []
  for(let i = 1; i < 9; i ++ ){
    fakers.push(createFakeMart(i))
    addresses.push(createAddress(i))
  }
  await knex('addresses').del()
  await knex('marts').del()

  // Inserts seed entries
  await knex('addresses').insert( [
    {
      ...createAddress(999),
      id: "address_00"
    },
    ...addresses ]);
   
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
          image: null,
          responsible_name:"Lucas Fonseca Barretp",
          financial_email: faker.internet.email(),
          corporate_name: faker.company.companyName(),
          address_id: `address_00`
        }, ...fakers
        
      ]);
   
};


