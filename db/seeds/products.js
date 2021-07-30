const { random } = require('faker')
const faker  = require('faker')

const presentations = ["Caixa com 24 unidades", "Granel","Unidade" ]

const createFakeProduct = (i) =>({
  id: 'prod_test_ID_0'+i, 
  description: faker.commerce.productName(),
  presentation: presentations[ Math.floor( Math.random() * presentations.length) ],
  stock: Math.floor( Math.random() * 999 ),
  price: Math.floor( Math.random() * 99 ),
  ncm: null,
  ean: null,
  sku: null,
  image: null,
  brand: Math.random() > .5 ? `Marca Teste` : null,
  provider_id: null,/* Math.random() > .5 ? `test_ID_0`+ Math.ceil( (Math.random() * 2 - 1) ) : null, */
  category_id: null/* Math.random() > .5 ? `test_ID_0`+ Math.ceil( (Math.random() * 2 - 1) ) : null,
  */
}) 

/* 
const createFakeCategories = async (knex) => {
  
  const TOTAL = 2
  const create = (i) => ({
      id: "test_ID_0"+i,
      name: faker.commerce.department(),
      category_id: null
  })
  const categories = []
  for(let i = 0; i < TOTAL; i ++ ){
    categories.push(create(i))
  }

  await knex('categories').del()
  await knex('categories').insert(categories);
}

const createFakeProvider = async (knex) => {

  const create = (i) =>({
    id: "test_ID_0"+i,
    name: faker.commerce.department(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber()
  })

  const providers = []
  for(let i = 0; i < 2; i ++ ){
    providers.push(create(i))
  }
  await knex('providers').del()
  await knex('providers').insert(providers);
} */

exports.seed = async function(knex) {

/* 
  await createFakeCategories(knex)
  await createFakeProvider(knex) */

  const products = []
  for(let i = 1; i < 20; i ++ ){
    products.push(createFakeProduct(i))
  } 

  await knex('products').del()
  await knex('products').insert(products);
  
   
};



/* 
const createFakeBrand = async (knex) => {

  const create = (i) => ({
    id: "test_ID_0"+i,
    name: faker.commerce.department(),
  })

  const brands = []
  for(let i = 0; i < 16; i ++ ){
    brands.push(create(i))
  }
  await knex('brands').del()
  await knex('brands').insert(brands);

} */