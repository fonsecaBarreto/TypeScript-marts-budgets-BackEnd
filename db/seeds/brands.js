

const brands_test = ["Amazon", "SpaceX","Apple", "Microsoft", "Pier", "Petrobras", "xiaomi", "Dell", "tio João", "Neve", "Danone", "Nestle"]

exports.seed = async function(knex) {

  const brands = []

  for(let i = 0; i < brands_test.length; i ++ ){
      const brand = {
        id: `test_brand_${i}`,
        name: brands_test[i]
      }
      brands.push(brand)
  } 
    
  await knex('brands').del()
  await knex('brands').insert(brands);
  
   
};


