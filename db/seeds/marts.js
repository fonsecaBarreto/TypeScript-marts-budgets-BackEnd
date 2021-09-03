
const { hashSync } = require('bcryptjs')
const faker  = require('faker')
const { cnpj } = require('cpf-cnpj-validator')

const createAddress = (id) =>{
  return (
  {
    id,
    address: faker.address.streetAddress(),
    address_region: faker.address.county(),
    address_number: Math.ceil(Math.random() * 200),
    address_postalcode: faker.address.zipCode(),
    address_city: faker.address.cityName(),
    uf: "RJ",
    details: ""
  })
  
}
const createCheckList = ({mart_id}) =>{
  return (
  {
    mart_id, 
    access_number: 0,
    first_suggestions:false,
    first_rating: false
  })
  
}

const createFakeMart = ({ id, address_id }) =>({
  id,
  name: 'Mercado Teste', 
  email: "emailtest@mail.com",
  phone: (faker.phone.phoneNumber()).replace(/[^\d]+/g,''),
  cnpj_cpf: (cnpj.generate()).replace(/[^\d]+/g,''),
  password: hashSync('123456'),
  transfer_allowed: Math.random() > 0.5 ? true : false,
  image: null,
  financial_email: faker.internet.email(),
  responsible_name:"Responsavel Estabelecimento teste",
  corporate_name: faker.company.companyName(),
  address_id,
})

exports.seed = async function(knex) {

  await knex('addresses').del()
  await knex('marts').del()
  await knex('marts_checklists').del()
  
  await knex('addresses').insert( [ createAddress('address_mart_00') ]);
  await knex('marts').insert([  createFakeMart({ id: 'mart_00', address_id: 'address_mart_00'}) ]);
  await knex('marts_checklists').insert(createCheckList({mart_id:'mart_00'}))
   
};


