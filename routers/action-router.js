const express = require('express');

const router = express.Router()

const actionDatabase = require('../data/helpers/actionModel'
);

router.get('/', (req, res) => {
    actionDatabase.get()
    .then((actions) => {
        res.status(200).json(actions);
    })
    .catch((err) => {
        res.status(500)
        .json({message: 'The server could not retrieve the actions.'})
    })
})

router.get('/:id', (req, res) => {
    const {id} = req.params;
    actionDatabase.get(id)
    .then((action) => {
        res.status(200)
        .json(action);
    })
    .catch(err => {
        res.status(500)
        .json({message: 'This action could not be found.'})
    })
})

router.post('/', (req, res) => {
    const newAction = req.body;
    if (newAction.description.length < 129) {
        if(newAction.description && newAction.notes) {
            actionDatabase.insert(newAction)
            .then(newAction => {
                res.json({message: 'Action was added successfully.'})
            })
            .catch(err => {
                res.json({message: 'Could not add the action.'})
            })
        }
        else {
            res.json({message: 'An action must have a description and notes.'})
        }
    }
    else {
        res.json({message: "An action's description must be less than 128 characters."})
    } 
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    if (changes.description && changes.notes) {
        if (changes.description.length < 129) {
            actionDatabase.update(id, changes)
            .then(updates => {
                res.json({message: 'Action was updated successfully.'})
            })
            .catch(err => {
                res.status(404)
                .json({message: 'This action ID could not be found.'})
            })
        }
        else {
            res.json({message: "An action's description must be less than 128 characters."})
        }
    }
    else {
        res.json({message: 'An action must contain a descirption and notes.'})
    }
})

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    actionDatabase.remove(id)
    .then(action => {
        if (action) {
            res.json({message: 'Action deleted successfully.'})
        }
        else {
            res.json({message: 'This action ID could not be found'})
        }
        })
    .catch(err => {
        res.status(500).json({message: 'The server could not delete this action.'})
    })
})

module.exports = router;