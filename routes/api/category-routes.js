const router = require('express').Router();
const e = require('express');
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
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(400).json({ message: "No category found"})
    }
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const updated = await Category.create({
      category_name: req.body.category_name
    })
    res.send(updated);
  } catch (err) {
    res.status(400).send(err.errors.map(e => e.message))
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updated = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.send(updated)
  } catch (err) {
    res.status(400).json(err.errors.map(e => e.message))
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const destroyCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!destroyCategory) {
      res.status(400).json({ message: "No category found" })
    } else {
      res.json(destroyCategory)
    }
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

module.exports = router;