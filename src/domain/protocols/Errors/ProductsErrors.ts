import ApplicationError from './ApplicationError'


export const ProductNotFoundError = () => (
    new ApplicationError('ProductNotFoundError', "Producto não encontrado ", {'product_id': "Produto não existe"}))
    
export const CategoryNotFound = () => (
    new ApplicationError('CategoryNotFound', "Categoria não encontrada ", {'category_id': "Categoria referenciada não existe"}))
