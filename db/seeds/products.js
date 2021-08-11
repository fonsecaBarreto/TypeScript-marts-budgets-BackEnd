const xlsx = require('xlsx');
const path = require('path')
const { v4 } = require('uuid')

const MakeProductItem = (name) =>({
  id: v4(),
  name,
  description: "",
  category_id: null
})

const MakeBrand= (name) =>({
  id: v4(),
  name,
})

const MakeProduct = (description, presentation, item_id, brand_id ) =>({
  id: v4(),
  description: description || "Sem Nome",
  presentation,
  ncm: null,
  ean: null,
  sku: null,
  image: null,
  brand_id,
  item_id,
}) 



exports.seed = async function(knex) {
  

  const workbook = xlsx.readFile(path.join(__dirname,'..','INITIAL_DATA',"teste.xlsx"));
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const items = []

  var item = {
    item_name: "",
    products: [ ]
  }

  var product = {
    brand_name: "",
    product_description: "",
    product_presentation : ""
  }

  for (let cell in worksheet) {
 
      const cellAsString = cell.toString();

      
      if (cellAsString[0] === '!' || cell[1] === "1") continue;

          if (cellAsString[0] === 'A') {
            if(worksheet[cell].v) {
              if(item.item_name){
                items.push(item)
                item={
                  item_name: "",
                  products: [ ]
                }
              }
              item.item_name = worksheet[cell].v
            }
          }
          if (cellAsString[0] === 'B') {
            product.brand_name = worksheet[cell].v;
          }
          if (cellAsString[0] === 'C') {
            product.product_description = worksheet[cell].v;
          }
          if (cellAsString[0] === 'D') {
            product.product_presentation = worksheet[cell].v;
            item.products.push(product);
            product = {};
        }
      
  }


  const itemsToInsert = []
  const brandsToInsert = []
  const productsToInsert = []
  await Promise.all(items.map( async (i)=>{
    const { item_name, products } = i
    const createdItem = MakeProductItem(item_name)
    itemsToInsert.push(createdItem)

    await Promise.all(products.map(async (p)=>{
       const {  brand_name, product_description, product_presentation } = p
        let brand = brandsToInsert.find(b=>b.name === brand_name)
        if(!brand){
          brand = MakeBrand(brand_name)
          brandsToInsert.push(brand)
        } 
        let product= MakeProduct(product_description, product_presentation, createdItem.id, brand.id)
        if(!product.description){
          console.log(createdItem.name)
        }
        productsToInsert.push(product)
    }))
  }))
   console.log(productsToInsert) 
  await knex('product_items').del()
  await knex('products').del() 
  await knex('brands').del() 

  await knex('product_items').insert(itemsToInsert);
  await knex('brands').insert(brandsToInsert);
  await knex('products').insert(productsToInsert);   

};




/* 
console.log(posts); */




/* const { v4 } = require('uuid')
const faker  = require('faker')
const presentations = ["Caixa com 24 unidades", "Granel","Unidade" ]

const items = [ "Farinha de Trigo panificação","Farinha de Trigo pão congelado","Farinha de Trigo para Confeitaria","Farinha de Trigo Integral",
"Farinha de Trigo para Biscoitos","Farinha de Trigo para Massas","Farinha de Trigo uso diverso","Farinha de Trigo uso doméstico",
"Farinha de Trigo Food Service","Fermento em pó quimico","Fermento Biologico ","Mistura para pão Francês","Mistura para pães Especiais",
"Mistura para pão integral","Mistura para pão doce","Mistura para bolos"]


const products = ["Panificação ","Extra para panificação","Master Premium","Pão Caseiro","Goumert","Tipo 1 - Panificação e confeitaria","Premium - Panificação e confeitaria",
"Tipo 1","Panetone","Extra Clara","Panificação - pão Francês","Premium","Semolada","Semolada sem aditivo","Semolada Premium","Semolada Extra Clara","Pão Francês",
"Premium - Pão Francês","Especial","Premium - Saco ráfia","Panificação - Saco papel","Panificação - Congelado","Semolada pão congelado","Premium - Pão Congelado",
"Confeitaria","Integral","Biscoitos","Massas","Tipo ","Tipo 1 com fermento","Com fermento","Tipo 2","Tipo 1 - Bag plástico","Tipo 1 premium - Bag Plástico",
"Salgados - Bag Plástico","Pizza - Bag Plástico","Pastel - Bag plástico","Tipo 1 - Bag papel","Tipo 1 premium - Bag Papel","Salgados - Bag Papel","Pizza - Bag Papel",
"Pastel - Bag Papel","Fermento em pó","Massa doce","Pães e pizza","Ouro","Pão congelado","Mix","Mix Premium","Mix Ouro","Cuca Alemã","Pão de Batata","Pão de Centeio",
"Pão Integral","pão doce","Sabor Laranja","Sabor Coco","Sabor Baunilha","Sabor Chocolate","Sabor Chocolate Suave","Sabor milho","Sabor Festa","Sabor Cenoura","Sabor Neutro",
"Sabor Abacaxi","Aipim","Sabor Milho","Sabor coco","Sabor banana","Sabor maracujá"]

const createFakeItem = (i) =>({
  id: v4(),
  name: items[i],
  description: "",
  category_id: null
})

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
  brand_id: null
  item_id: `item_test_ID${Math.ceil(Math.random() * 16 ) - 1}`,
 
}) 

exports.seed = async function(knex) {

  const products = []
  const items = []
  
  for(let i = 0; i < 16; i ++ ){
    items.push(createFakeItem(i))
  } 

  
  for(let i = 0; i < 99; i ++ ){
    const p = createFakeProduct(i)
    products.push(p)
  } 
  
  await knex('product_items').del()
  await knex('products').del()
  await knex('product_items').insert(items);
  await knex('products').insert(products); 
  

};


 */