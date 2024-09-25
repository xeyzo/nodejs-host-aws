import express, { json } from 'express';
import morgan from 'morgan';
import fs from 'fs';
import bodyParser from 'body-parser';


var path = './store/todos.json'
const app = express();
const port = 3000;


app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send({ message: "Hello World" });
});

app.get('/todos', (req, res) => {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (!err) {
            const todos = JSON.parse(data);

            return res.send({
                message: "Your data succesfully loaded",
                data: todos,
                status: 200
            }).status(200)
        }

        return res.send({ message: "Something went wrong" }).status(404)
    })
});

app.get('/todos/:id', (req, res) => {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (!err) {
            const todos = JSON.parse(data);

            const filterData = todos.findIndex(data => data.id == req.params.id)
            console.log(filterData)

            if (filterData < 0) {
                return res.send({ message: `data id ${req.params.id} not found` }).status(404)
            }

            return res.send({
                message: "Your data succesfully loaded",
                data: todos[filterData],
                status: 200
            }).status(200)
        }

        return res.send({ message: "Not found" }).status(404)
    })
});

app.post('/todos', (req, res) => {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (!err) {
            const todos = JSON.parse(data);

            const findMaxId = Math.max.apply(Math, todos.map(t => { return t.id }));
            const generatedId = findMaxId + 1;

            todos.push({
                id: generatedId,
                title: `${req.body.title} ${generatedId}`
            });

            fs.writeFile(path, JSON.stringify(todos), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file', err);
                } else {
                    console.log('File has been updated successfully');
                }
            });

            return res.send({
                message: "Adding new data succesfully",
                data: req.body,
                status: 200
            }).status(200);
        }

        return res.send({ message: "Something went wrong" });
    })
})

app.delete('/todos/:id', (req, res) => {
    fs.readFile(path, 'utf-8', (err, data) => {

        if (err) {
            return res.send({
                message: "Something Went Wrong"
            })
        };

        const todos = JSON.parse(data);

        const findData = todos.findIndex(data => data.id == req.params.id);

        if (findData < 0) {
            return res.send({ message: `data id ${req.params.id} not found` }).status(404)
        };

        const result = todos.filter(item => item.id != req.params.id);

        fs.writeFile(path, JSON.stringify(result), 'utf-8', (err) => {
            if (err) {
                console.error('Error writing file', err);
            } else {
                console.log('File has been updated successfully');
            }
        });

        return res.send({
            message: `data id ${req.params.id} has been deleted`
        });
    });
});



app.listen(port, () => {
    console.log(`your application ready on port http://localhost:${port}`)
});