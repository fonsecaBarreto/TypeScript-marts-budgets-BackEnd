const faker  = require('faker')

const presentations = ["Caixa com 24 unidades", "Granel","Unidade" ]
const brands = [ "piracanjuba", "Macuco", "Apple", "Ms", "Tio João"]

const createFakeProduct = (i) =>({
  id: 'prod_test_0'+i, 
  description: faker.commerce.productName(),
  presentation: presentations[ Math.floor( Math.random() * presentations.length) ],
  brand: brands[ Math.floor( Math.random() * brands.length) ],
  provider: faker.company.companyName(),
  category_id: null,
  stock: Math.floor( Math.random() * 999 )
})

exports.seed = async function(knex) {

  const fakers = []
  for(let i = 1; i < 2001; i ++ ){
    fakers.push(createFakeProduct(i))
  }

  console.log(fakers)
  await knex('products').del()

      // Inserts seed entries
  await knex('products').insert(fakers);
   
};


