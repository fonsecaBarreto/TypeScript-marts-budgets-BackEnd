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
  brand_id: Math.random() > .5 ? `test_ID_0`+ Math.ceil( (Math.random() * 6 - 1) ) : null,
  provider_id: Math.random() > .5 ? `test_ID_0`+ Math.ceil( (Math.random() * 6 - 1) ) : null,
  category_id: Math.random() > .5 ? `test_ID_0`+ Math.ceil( (Math.random() * 6 - 1) ) : null,
})


const createFakeCategories = async (knex) => {
  
  const TOTAL = 8
  const create = (i) => ({
      id: "test_ID_0"+i,
      name: faker.commerce.department(),
      category_id: Math.random() > .5 ? `test_ID_0`+ Math.ceil( (Math.random() * TOTAL - 1) ) : null
  })
  const categories = []
  for(let i = 0; i < TOTAL; i ++ ){
    categories.push(create(i))
  }

  await knex('categories').del()
  await knex('categories').insert(categories);
}

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

}

const createFakeProvider = async (knex) => {

  const create = (i) =>({
    id: "test_ID_0"+i,
    name: faker.commerce.department(),
  })

  const providers = []
  for(let i = 0; i < 16; i ++ ){
    providers.push(create(i))
  }
  await knex('providers').del()
  await knex('providers').insert(providers);
}

exports.seed = async function(knex) {


  await createFakeCategories(knex)
  await createFakeBrand(knex)
  await createFakeProvider(knex)

  const products = []
  for(let i = 1; i < 49; i ++ ){
    products.push(createFakeProduct(i))
  }

  await knex('products').del()
  await knex('products').insert(products);
  
   
};


