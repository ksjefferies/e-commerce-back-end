const router = require('express').Router();
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

/*
  Tag.create({
    tag_name: req.body.tag_name
  })
  */

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

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then((tag) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const destroyTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    if (destroyTag) {
      res.status(400).json({ message: "No tag found" })
    }
    res.json(destroyTag)
  }
  catch {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
