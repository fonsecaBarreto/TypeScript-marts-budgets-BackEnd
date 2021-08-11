import ApplicationError from './ApplicationError'

export const ProductNotFoundError = () => (
    new ApplicationError('ProductNotFoundError', "Producto não encontrado ", {'product_id': "Produto não existe"}))
    

export const BrandNotFoundError = () => (
    new ApplicationError('BrandNotFoundError', "Marca não encontrada", {'brand_id': "Marca não existe"}))
    
export const CategoryNotFoundError = () => (
    new ApplicationError('CategoryNotFoundError', "Categoria não encontrada ", {'category_id': "Categoria referenciada não existe"}))

export const ProductItemNotFoundError = () => (
    new ApplicationError('ProductItemNotFoundError', "Item não encontrada ", {'item_id': "Item referenciado não existe"}))


export const ProviderNotFoundError = () => (
    new ApplicationError('ProviderNotFoundError', "Fornecedor Não encontado ", {'provider_id': "Fornecedor Desconhecido."}))

    /* categories */
export const CategoryConflictError = () => (
    new ApplicationError('CategoryConflictError', "Categoria não pode herdar de si mesmo", {'category_id': "Categoria não pode herdar de si mesmo"}))
    
 
/*  Products */
    
export const ProductCodeInUseError = (param:string) =>(
    new ApplicationError('ProductCodeInUseError', ` ${param} já esta em uso`, { param: ` ${param} já esta em uso` }))


export const InvalidForecastDateError = () =>(
    new ApplicationError('InvalidForecastDateError', `Data prevista deve ser posterior a atual`, { forecast: `Data prevista deve ser posterior a atual` }))

    
    