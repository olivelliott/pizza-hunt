const { Pizza } = require('../models');

const pizzaController = {
    // get all pizzas
    getAllPizza(req, res) {
        Pizza.find({})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get one pizza by ID
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create pizza
    createPizza({ body }, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {res.status(400).json(err)});
    },

    // update pizza by ID
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ id: params.id }, body, { new: true })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete pizza by ID
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ id: params.id })
       .then(dbPizzaData => {
        if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id' });
            return;
        }
        res.json(dbPizzaData);
       })
       .catch(err => res.status(400).json(err));
    }
}

module.exports = pizzaController;