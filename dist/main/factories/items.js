"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsSearchController = exports.filterListItem = exports.listItemsScrewView = exports.removeItemController = exports.findItemController = exports.updateItemController = exports.createItemController = exports.serializers = void 0;
const depedencies_1 = require("./depedencies");
const CreateProductItem_1 = require("../../presentation/controllers/products-items-controllers/CreateProductItem");
const UpdateProductItem_1 = require("../../presentation/controllers/products-items-controllers/UpdateProductItem");
const ReadDelete_1 = require("../../presentation/controllers/products-items-controllers/ReadDelete");
const ItemsScrewView_1 = require("../../presentation/controllers/products-items-controllers/ItemsScrewView");
const ListItems_1 = require("../../presentation/controllers/products-items-controllers/ListItems");
const ItemsSearchController_1 = require("../../presentation/controllers/products-items-controllers/ItemsSearchController");
const KnexAdapter_1 = __importDefault(require("../../libs/KnexAdapter"));
const products_1 = require("./products");
const ItemView_1 = require("../../presentation/controllers/products-items-controllers/serializers/ItemView");
const FullItemView_1 = require("../../presentation/controllers/products-items-controllers/serializers/FullItemView");
const { itemsRepository, categoriesRepository, productsRepository } = depedencies_1.repositories;
const { idGenerator } = depedencies_1.vendors;
exports.serializers = {
    itemView: ItemView_1.MakeItemView(categoriesRepository),
    itemFullview: FullItemView_1.MakeItemFullView(categoriesRepository, productsRepository, products_1.serializers.productView)
};
exports.createItemController = new CreateProductItem_1.CreateProductItemController(itemsRepository, categoriesRepository, idGenerator, exports.serializers.itemView);
exports.updateItemController = new UpdateProductItem_1.UpdateProductItemController(itemsRepository, categoriesRepository, exports.serializers.itemView);
exports.findItemController = new ReadDelete_1.FindController(itemsRepository, exports.serializers.itemView);
exports.removeItemController = new ReadDelete_1.RemoveController(itemsRepository);
exports.listItemsScrewView = new ItemsScrewView_1.ListItemsScrewView(itemsRepository);
exports.filterListItem = new ListItems_1.FilterListItem(itemsRepository, KnexAdapter_1.default.connection, products_1.serializers.productView);
exports.itemsSearchController = new ItemsSearchController_1.ItemsSearchController(KnexAdapter_1.default.connection, products_1.serializers.productView);
