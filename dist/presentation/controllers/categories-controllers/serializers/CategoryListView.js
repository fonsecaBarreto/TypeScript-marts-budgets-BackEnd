"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCategoryListView = exports.MakeCategoryListView = void 0;
const getFather = async (sup_id, categoriesRepository) => {
    if (!sup_id)
        return null;
    var bread_crumbs = [];
    const supCategory = await categoriesRepository.find({ id: sup_id }, ['name', 'category_id']);
    bread_crumbs = [supCategory.name];
    const result = await getFather(supCategory.category_id, categoriesRepository);
    if (result) {
        bread_crumbs = [...bread_crumbs, result.name];
    }
    return { ...supCategory, bread_crumbs };
};
const MakeCategoryListView = async (categoriesRepository, category) => {
    if (!category)
        return null;
    const supCategory = await getFather(category.category_id, categoriesRepository);
    return { id: category.id, name: category.name, bread_crumbs: (supCategory === null || supCategory === void 0 ? void 0 : supCategory.bread_crumbs) || [] };
};
exports.MakeCategoryListView = MakeCategoryListView;
const MapCategoryListView = (categoriesRepository, categories) => {
    if (categories.length === 0)
        return Promise.resolve([]);
    return Promise.all(categories.map(async (c) => {
        return exports.MakeCategoryListView(categoriesRepository, c);
    }));
};
exports.MapCategoryListView = MapCategoryListView;
