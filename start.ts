import express, {Application, Request, Response} from "express"
import mainApp from "./mainApp";
import "./UTILSMongo/dbConfig"
import cors from 'cors'


const port: number = 9977;
const app: Application = express();

app.use(cors())

app.use(express.json()) 

mainApp(app)

const server = app.listen(port, ()=> {
    console.log("server is now connected...")
});

// console.timeEnd("start server")

process.on("uncaughtException", (error: Error) =>{
    console.log("uncaughtException: ", error);
    process.exit(1)
});

process.on("rejectionHandled", (reason:any) =>{
    console.log("rejectionHandled:", reason);

    server.close(() =>{
        process.exit(1)
    });
});