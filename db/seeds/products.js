
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
  brand_id: `test_brand_${Math.ceil( Math.random() * 12) - 1 }`,
  category_id: `test_sub_category_${Math.ceil(Math.random() * 6 ) - 1}-${Math.ceil(Math.random() * 3) - 1}`,
 
}) 

exports.seed = async function(knex) {

  const products = []
  for(let i = 1; i < 99; i ++ ){
    products.push(createFakeProduct(i))
  } 

  await knex('products').del()
  await knex('products').insert(products);
  

};


