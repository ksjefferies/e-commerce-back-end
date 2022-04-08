const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const allCategories = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      ]
    })
    if (allCategories) {
      res.status(200).json(allCategories)
    } else {
      res.status(400).json({ message: "Category not found" })
    }
    // be sure to include its associated Products
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// find one category by its `id` value
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id
      },
      // be sure to include its associated Products
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      ]
    })
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  try {
    Category.create({
      category_name: req.body.category_name
    })
      .then((category) => {

        if (req.body.tagIds.length) {
          const categoryTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              category_id: category.id,
              tag_id,
            };
          });
          return CategoryTag.bulkCreate(categoryTagIdArr);
        }
        // if no category tags, just respond
        res.status(200).json(category);
      })
      .then((categoryTagIds) => res.status(200).json(categoryTagIds))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
  catch {
    console.log(err)
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  try {
    Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((product) => {
        // find all associated tags from ProductTag
        return ProductTag.findAll({ where: { product_id: req.params.id } });
      })
      .then((categoryTags) => {
        // get list of current tag_ids
        const categoryTagIds = categoryTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newCategoryTags = req.body.tagIds
          .filter((tag_id) => !categoryTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              category_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const categoryTagsToRemove = categoryTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        // run both actions
        return Promise.all([
          CategoryTag.destroy({ where: { id: categoryTagsToRemove } }),
          CategoryTag.bulkCreate(newCategoryTags),
        ]);
      })
      .then((updatedCategoryTags) => res.json(updatedCategoryTags))
      .catch((err) => {
        // console.log(err);
        res.status(400).json(err);
      });
  }
  catch {
    console.log(err)
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const destroyCategory = await Catergory.destroy({
      where: {
        id: req.params.id
      }
    })
    if (destroyCategory) {
      res.status(400).json({ message: "No category found" })
    }
    res.json(destroyCategory)
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

module.exports = router;
