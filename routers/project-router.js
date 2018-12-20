const express = require('express');

const router = express.Router()

const projectDatabase = require('../data/helpers/projectModel'
);

router.get('/', (req, res) => {
    projectDatabase.get()
    .then((projects) => {
        res.status(200).json(projects);
    })
    .catch((err) => {
        res.status(500)
        .json({message: 'The server could not retrieve the projects.'})
    })
})

router.get('/:id', (req, res) => {
    const {id} = req.params;
    projectDatabase.get(id)
    .then((project) => {
        res.status(200)
        .json(project);
    })
    .catch(err => {
        res.status(500)
        .json({message: 'This project could not be found.'})
    })
})

router.get('/:id/actions', (req, res) => {
    const {id} = req.params;
    projectDatabase.getProjectActions(id)
    .then(actions => {
        res.json(actions);
    })
    .catch(err => {
        res.status(500)
        .json({message: 'The server could not retrieve the actions of the the selected project.'})
    })
})

router.post('/', (req, res) => {
    const newProject = req.body;
    if (newProject.name && newProject.description) {
        projectDatabase.insert(newProject)
            .then((project) => {
                res.json(project);
            })
            .catch(err => {
                res.json({message: 'Could not add the project.'})
            })
        }
    else {
            res.json({message: 'A project must have a name and description.'})
    }
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    if (changes.name && changes.description) {
        if (changes.name.length < 129) {
            projectDatabase.update(id, changes)
            .then(updates => {
                res.json(updates);
            })
            .catch(err => {
                res.status(404)
                .json({message: 'This project could not be updated'})
            })
        }
        else {
            res.json({message: "A project's name must be less than 128 characters."})
        }
    }
    else {
        res.json({message: 'A project must contain a name and description.'})
    }
})

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    projectDatabase.remove(id)
    .then(project => {
        if (project) {
            res.json({message: 'Project deleted successfully.'})
        }
        else {
            res.json({message: 'This project ID could not be found'})
        }
        })
    .catch(err => {
        res.status(500).json({message: 'The server could not delete this project.'})
    })
})

module.exports = router;