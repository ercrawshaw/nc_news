// users-router.js
const userRouter = require('express').Router();

userRouter.get('/', (req, res) => {
  res.status(200).send('All OK from /api/users');
});

userRouter.get('/:id', (req, res) => {
  res.status(200).send('All OK from /api/users/:id');
});

userRouter.get('/:id/shoppingList', (req, res) => {
  res.status(200).send('All OK from /api/users/:id/shoppingList');
});

module.exports = userRouter;