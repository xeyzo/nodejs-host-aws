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
        if (err) {
            return res.send({message:"something went wrong"}).status(500)
        }
        
        const todos = JSON.parse(data);

        return res.send({
            message: "Your data succesfully loaded",
            data: todos,
            status: 200
        }).status(200)
    })
});

app.listen(port, ()=> {
    console.log(`your application ready on port http://localhost:${port}`)
})