"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCategoryTreeView = exports.MapCategoryListView = exports.MakeCategoryListView = void 0;
const MakeCategoryListView = (category) => {
    if (!category)
        return null;
    return { id: category.id, name: category.name };
};
exports.MakeCategoryListView = MakeCategoryListView;
const MapCategoryListView = (categories) => {
    if (categories.length === 0)
        return Promise.resolve([]);
    categories.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
    return Promise.all(categories.map(async (c) => {
        return exports.MakeCategoryListView(c);
    }));
};
exports.MapCategoryListView = MapCategoryListView;
const MapCategoryTreeView = (categoriesRepository, categories) => {
    if (categories.length === 0)
        return Promise.resolve([]);
    //find ou the childs of ir
    return Promise.all(categories.map(async (c) => {
        const children = await categoriesRepository.list({ category_id: c.id });
        return { ...c, children };
    }));
};
exports.MapCategoryTreeView = MapCategoryTreeView;
