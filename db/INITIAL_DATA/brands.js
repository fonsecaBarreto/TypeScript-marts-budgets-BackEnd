
const { v4 } = require('uuid')
const brands_test = ["Melhor Preço","Rosa Branca","Rosa Ouro","Lux","Nativa","Nita","Invencivel","Fada","Suprema","Predileta","Suprema ","Soberana","Suprema Jauense","Regina","Vitória","Beija-Flor","Pré-Massa ","Dona Benta","Branca de Neve","Brandini","SM","Três Coroas","Tulipa Branca","Maxi","Tulipa","UMA","Carioca"]

exports.seed = async function(knex) {

  const brands = []

  for(let i = 0; i < brands_test.length; i ++ ){
      const brand = {
        id: v4(),
        name: brands_test[i]
      }
      brands.push(brand)
  } 
    
  await knex('brands').del()
  await knex('brands').insert(brands);
   
};



