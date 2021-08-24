const fs  = require("fs")
const path = require('path')
const xlsx = require('xlsx')
const planilha  = fs.readFileSync(path.join(__dirname,'..','INITIAL_DATA','items.xlsx'))

const { v4 } = require('uuid')

const read = async ({ file, schema }) =>{

    const workbook = xlsx.read(file);
    if(!workbook.SheetNames.includes('items')) throw new Error("SheetDoenstExits")
    
    const sheet = workbook.Sheets['items'];

    const json = xlsx.utils.sheet_to_json(sheet)

    var list = []

    json.map( (col) =>{

        var serializedColumn = { }

        Object.keys(schema).map((label)=>{ // Verifica se contem todas as chaves do squema
            const key = schema[label] 
            serializedColumn[key] = col[label] ? col[label] : null
        })

        return list.push(serializedColumn)
    })

    return list

}



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
  
  const json = await read({
    file: planilha,
    schema:{
      "Item":"item", 
      "Marca":"brand",
      "Especificação":"description",
      "Apresentação": "presentation"
    }}
  )
  var itemsToInsert=[]
  var brandsToInsert=[]
  var productsToInsert=[]

  for (var n =0 ; n < json.length ; n ++){
    var row = json[n]
    const { item, brand, description, presentation } = row

    //item
    var itemExists = itemsToInsert.find((j,i)=>(j.name === item)) 
    if(!itemExists) { 
       itemExists = MakeProductItem(row.item)
      itemsToInsert.push(itemExists)  
    }

    //brand
    var brandExists = brandsToInsert.find((j,i)=>(j.name === brand))
    console.log('marca',brandExists)
    if(!brandExists) {
      brandExists = MakeBrand(brand)
      brandsToInsert.push(brandExists)
    }

    //products
    let product= MakeProduct(description, presentation, itemExists.id, brandExists.id)
    productsToInsert.push(product)

  }

  await knex('product_items').del()
  await knex('products').del() 
  await knex('brands').del() 


  await knex('product_items').insert(itemsToInsert);
  await knex('brands').insert(brandsToInsert);
  await knex('products').insert(productsToInsert); 

};



