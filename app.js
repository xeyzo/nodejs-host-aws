import express, { json } from 'express';
import morgan from 'morgan';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;


app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req,res) => {
    res.send({message : "Hello World"});
});

app.get('/todos', (req,res)=> {
    fs.readFile('./store/todos.json','utf-8',(err, data)=>{
        if (!err) {
            const todos = JSON.parse(data);
            console.log(todos)

            return res.send({
                message: "Your data succesfully loaded",
                data: todos,
                status: 200
            }).status(200)
        }

        return res.send({message:"Something went wrong"}).status(404)
    })
});

app.get('/todos/:id', (req,res)=> {
    fs.readFile('./store/todos.json','utf-8',(err, data)=>{
        if (!err) {
            const todos = JSON.parse(data);

            const filterData = todos.findIndex(data => data.id == req.params.id)
            console.log(filterData)

            return res.send({
                message: "Your data succesfully loaded",
                data: [todos[filterData]],
                status: 200
            }).status(200)
        }

        return res.send({message:"Not found"}).status(404)
    })
});

app.listen(port, ()=> {
    console.log(`your application ready on port http://localhost:${port}`)
})