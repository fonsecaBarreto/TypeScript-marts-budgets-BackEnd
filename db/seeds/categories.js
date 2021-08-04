const categorias_test = [
  { name: "Grãos" , childs :[
    {name: "feijão"},
    {name: "grão de bico "},
    {name: "lentilha"}
  ] },
  { name: "Cereais" , childs :[
    {name: "arroz"},
    {name: "milho"},
    {name: "Aveia"},
  ] },
  { name: "Laticínios" , childs :[
    {name: "Leite Longa vida"},
    {name: "Iogurte"},
    {name: "Queijo"},
  ] },
  { name: "Frutas" , childs :[
    {name: "uva"},
    {name: "maça"},
    {name: "banana"}
  ] },
  { name: "Vegetais" , childs :[
    {name: "Abobrinha"},
    {name: "Chuchu"},
    {name: "Alface"}
  ] },
  { name: "Industrializados" , childs :[
    {name: "danoninho"},
    {name: "todynho"},
    {name: "salsicha"},
  ] }
]

exports.seed = async function(knex) {

  const categories = []
  for(let i = 0; i < categorias_test.length; i ++ ){

    const category = {
      id: `test_category_${i}`,
      name: categorias_test[i].name,
      category_id: null
    }
    categories.push(category)

    for(let j= 0 ; j < categorias_test[i].childs.length ; j ++ ){
      const subCategory = {
        id: `test_sub_category_${i}-${j}`,
        name: categorias_test[i].childs[j].name,
        category_id: category.id
      }

      categories.push(subCategory)
    } 
    
  } 

  await knex('categories').del()
  await knex('categories').insert(categories);
  
   
};


