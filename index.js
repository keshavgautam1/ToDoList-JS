const express = require('express');
const app = express(); // Create the app instance

const port = 7000;

app.use(express.static("./views"));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

const db = require('../TodoList/configs/mongoose'); // Check this path
const Task = require('../TodoList/model/task');

// Routes and middleware using the 'app' instance
app.get('/', async function(req, res){
    try {
        const task = await Task.find({});
        return res.render('home', {
            title: "Home",
            task: task
        });
    } catch (err) {
        console.log('Error in fetching tasks from db:', err);
        return res.status(500).send('Internal Server Error');
    }
});


app.post('/create-task', async function(req, res) {
    try {
        const newTask = await Task.create({
            description: req.body.description,
            category: req.body.category,
            date: req.body.date
        });
        console.log('New task created:', newTask);
        return res.redirect('/');
    } catch (err) {
        console.log('Error in creating task:', err);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/delete-task', async function(req, res) {
    const idsToDelete = Object.keys(req.query);

    try {
        for (const taskId of idsToDelete) {
            await Task.findByIdAndDelete(taskId);
            console.log('Task deleted:', taskId);
        }
        return res.redirect('/');
    } catch (err) {
        console.log('Error in deleting task:', err);
        return res.status(500).send('Internal Server Error');
    }
});


app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});
