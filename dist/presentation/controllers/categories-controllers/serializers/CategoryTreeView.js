"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCategoryTreeView = exports.MakeCategoryTreeView = void 0;
const MakeCategoryTreeView = async (categoriesRepository, category, children) => {
    if (!category)
        return null;
    const supCategory = await categoriesRepository.find({ id: category === null || category === void 0 ? void 0 : category.category_id }, ['name', 'category_id']);
    return { id: category.id, name: category.name, children, category_name: supCategory === null || supCategory === void 0 ? void 0 : supCategory.name };
};
exports.MakeCategoryTreeView = MakeCategoryTreeView;
const MapCategoryTreeView = (categoriesRepository, categories, serializer) => {
    if (categories.length === 0)
        return Promise.resolve([]);
    return Promise.all(categories.map(async (c) => {
        const result = await categoriesRepository.list({ category_id: c.id });
        var children = await exports.MapCategoryTreeView(categoriesRepository, result, serializer && serializer);
        return serializer ? await serializer(categoriesRepository, c, children) : { ...c, children };
    }));
};
exports.MapCategoryTreeView = MapCategoryTreeView;
