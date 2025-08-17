const Category = require("../models/category.model");

const buildCategoryTree = (categoryList, parentId = '') => {
  const tree = []
  categoryList.forEach(item => {
    if(item.parent==parentId) {
      const children = buildCategoryTree(categoryList, item.id)
      tree.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        children: children
      })
    }
  });
  return tree
}
module.exports.buildCategoryTree = buildCategoryTree

module.exports.getAllSubcategoryIds = async (parentId) => {
  const result = [parentId]
  const findChildren = async (currentId) => {
    const children = await Category.find({
      parent: currentId,
      deleted: false,
      status: "active"
    })
    for(const child of children) {
      result.push(child.id)
      await findChildren(child.id)
    }
  }

  await findChildren(parentId)
  return result
}