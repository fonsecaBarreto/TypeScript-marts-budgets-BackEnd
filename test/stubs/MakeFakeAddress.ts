import { Addresses } from '../../src/domain/entities/Addresses'
import faker from 'faker'
export const MakeFakeAddress = ( fields?: Partial<Addresses>): Addresses =>{
    return (
    {
      id: "test_01",
      address: faker.address.streetAddress(),
      address_region: faker.address.county(),
      address_number: Math.ceil(Math.random() * 200) + "",
      address_postalcode: faker.address.zipCode(),
      address_city: faker.address.cityName(),
      uf: "RJ",
      details: "",
      ...fields
    })
    
}