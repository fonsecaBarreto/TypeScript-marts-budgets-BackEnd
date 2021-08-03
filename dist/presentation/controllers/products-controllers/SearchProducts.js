"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProductController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class SearchProductController extends MainController_1.MainController {
    constructor(knexConnection) {
        super(MainController_1.AccessType.MART);
        this.knexConnection = knexConnection;
    }
    async handler(request) {
        const c = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [request.query.c] : null;
        const categories = c || [];
        const brands = [];
        var description = "";
        var total = 0;
        var subTotal = 0;
        var products = [];
        console.log("categories", categories);
        const qb = (query) => {
            if (categories.length > 0) {
                query.AWhereIn('category_id', categories);
            }
            /*  */
            /* for (const col of columns) {
                query.orWhere(`${this.table}.${col}`, 'ilike', `%${alike}%`);
            } */
        };
        products = await this.knexConnection('products').where({}).andWhere(qb);
        /*   const queryData = await KnexAdapter.connection(this.table).where(where).andWhereNot(whereNot).andWhere(qb).limit(limit).offset(offset);
  
   */
        const result = { total, subTotal, products };
        return http_helper_1.success(result);
        /*  const text = request.query.v || '';
         var category_id = request.query.c || null;
 
         const offset = Number(request.query.o) || 0
         const total = await this.productsRepository.count({},'id')
         const where = category_id ? { category_id } : {}
 
         const { queryData, queryTotal } = await this.productsRepository.listAlike(['description','ncm', 'ean', 'sku', 'brand'], text, where,{}, offset, 16)
 
         const providerListFeed: ProductListFeed ={
             total,
             subTotal: queryTotal,
             queries: { text, category_id },
             data: queryData
         }
 
         return success(providerListFeed) */
    }
}
exports.SearchProductController = SearchProductController;
