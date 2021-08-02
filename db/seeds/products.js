const { random } = require('faker')
const faker  = require('faker')

const presentations = ["Caixa com 24 unidades", "Granel","Unidade" ]



const test_categories = ["Grãos", "Cereais", "laticínios", "Hortaliças", 'Vegetais', "Frutas", "Industrializados"]
const subCategories = [ "Leite", "Feijão", "Arroz", "Oleo de Cozinha", "Trigo", "Iogurte", "peixe", "Maça", "Uva"]
const brands = ["Amazon", "Apple", "Microsoft", "Pier", "Petrobras", "xiaomi", "Dell"]

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
  brand: brands[ Math.ceil( Math.random() * brands.length - 1 )  ],
  category_id: "test_ID_0"+ Math.ceil( (Math.random() * test_categories.length ) -1 ) 
}) 

const createFakeCategories = async (knex) => {
  
  const TOTAL = 16
  const create = (i) => {
    
    const cate = ({
      id: "test_ID_0"+i,
      name: i < test_categories.length ? test_categories[i] : 
        i < test_categories.length + subCategories.length ? subCategories[i - test_categories.length ] :
        faker.commerce.productName(),

      category_id: i < test_categories.length ? null :  "test_ID_0"+ Math.ceil( (Math.random() * 7 ) -1 ) 
    })
    return cate
}
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
  for(let i = 0; i < 10; i ++ ){
    providers.push(create(i))
  }
  await knex('providers').del()
  await knex('providers').insert(providers);
} 

exports.seed = async function(knex) {

  await createFakeCategories(knex)
   await createFakeProvider(knex)  

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