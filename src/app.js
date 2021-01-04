require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const foldersRouter = require('./folders/folders-router')
const FoldersService = require('./folders/folders-service')
const NotesService = require('./notes/notes-service')

 
const app = express()

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// app.use('/folders', foldersRouter)
app.get('/folders', (req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
    .then(folders => {
        res.json(folders)
    })
    .catch(next)
})

app.get('/notes', (req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
    .then(notes => {
        res.json(notes)
    })
    .catch(next)
})

app.delete('/folders/:folder_id', (req, res, next) => {
    FoldersService.deleteFolder(
        req.app.get('db'),
        req.params.folder_id
    )
    .then(folder => {
        if(!folder) {
            return res.status(404).json({
                error: {message: `Folder does not exist`}
            })
        }
        res.folder = folder
        next()
    })
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})


app.get('/', (req, res) => {
    res.send('Hello, world!')
});


app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
});

module.exports = app;