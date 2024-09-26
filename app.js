import express, { json } from 'express';
import morgan from 'morgan';
import fs from 'fs';
import bodyParser from 'body-parser';

const baseData = [
    {
        "id": 1,
        "title": "todo example 1"
    },
    {
        "id": 2,
        "title": "todo example 2"
    },
    {
        "id": 3,
        "title": "todo example 3"
    }
];

const app = express();
const port = 3000;


app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send({ message: "Hello World" });
});

app.get('/todos', (req, res) => {

        if (!baseData) {
            return res.send({
                message: "data not found"
            })
        }

        return res.send({
            message: "Your data succesfully loaded",
            data: baseData,
            status: 200
        }).status(200)

    return res.send({ message: "Something went wrong" }).status(404)
});

app.get('/todos/:id', (req, res) => {
        const filterData = baseData.findIndex(data => data.id == req.params.id);

        if (filterData < 0) {
            return res.send({ message: `data id ${req.params.id} not found` }).status(404)
        };

        return res.send({
            message: "Your data succesfully loaded",
            data: baseData[filterData],
            status: 200
        }).status(200);
    });

app.post('/todos', (req, res) => {

    const findMaxId = Math.max.apply(Math, baseData.map(t => { return t.id }));
    const generatedId = findMaxId + 1;

    if (!req.body.title) {
        return res.send({
            message: "Title mandatory"
        })
    } else {
        baseData.push({
            id: generatedId,
            title: `${req.body.title} ${generatedId}`
        });
    }

    const responseData = { id: generatedId, title: `${req.body.title} ${generatedId}` }

    return res.send({
        message: "Adding new data succesfully",
        data: responseData,
        status: 200
    }).status(200);
})

app.delete('/todos/:id', (req, res) => {

    const findData = baseData.findIndex(data => data.id == req.params.id);

    if (findData < 0) {
        return res.send({ message: `data id ${req.params.id} not found` }).status(404)
    };

    const result = baseData.filter(item => item.id != req.params.id);

    return res.send({
        message: `data id ${req.params.id} has been deleted`,
        data: result,
        status: 200
    }).status(200);
});



app.listen(port, () => {
    console.log(`your application ready on port http://localhost:${port}`)
});