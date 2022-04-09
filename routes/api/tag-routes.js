const router = require('express').Router();
const { response } = require('express');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const allTags = await Tag.findAll({
      // including its associated Product data
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      ]
    })
    if (allTags) {
      res.status(200).json(allTags)
    } else {
      res.status(400).json({ message: "No tag found" })
    }
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const tag = await Tag.findOne({
      where: {
        id: req.params.id
      },
      // including its associated Product data
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        },
      ]
    })
    if (tag) {
      res.status(200).json(tag)
    } else {
      res.status(400).json({ message: "No tag found" })
    }
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const postTag = await Tag.create({
      tag_name: req.body.tag_name
    })
    res.status(200).json(postTag)
  } catch {
    res.status(404).json({ message: "error creating tag" })
  };
});

router.put('/:id', async (req, res) => {
  const result = await Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  const response = { success: result[0] }
  result[0] >= 1 ? res.send(response) : res.status(400).json(response)
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const destroyTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!destroyTag) {
      res.status(400).json({ message: "No tag found" })
    } else {
      res.json(destroyTag)
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;