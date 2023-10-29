import { Application, Request, Response } from "express"
import { statusCode } from "./Utils/statusCode";
import {v4 as uuid} from "uuid"
import moment from "moment";
import path from "path";
import fs from "fs"
import { userModel } from "./UTILSMongo/userModel";
import { client, db } from "./UTILSMongo/dbConfig";
import {ObjectId} from 'mongodb'
import lodash from 'lodash'

interface iData{
    id:string,
    name:string,
    course:string,
    time:string
}

let database: Array<iData> = [
    {
        "id": "f9265a40-ad01-4cb2-b4b0-8e2f3311e76a",
        "name": "isaac",
        "course": "NodeJs",
        "time": "5:11:41 AM"
    },
    {
        "id": "7e0d8a5a-f1bc-4a38-95ca-ad7e15e4303c",
        "name": "stanley",
        "course": "NodeJs",
        "time": "5:12:41 AM"
    }
]

const mainApp = (app:Application) =>{
    app.get("/", (req:Request, res:Response):Response =>{
        try{
            return res.status(statusCode.ok).json({
                message: "welcome to my API v1",
                data:database
            })
        } catch(error) {
            return res.status(statusCode.BAD_REQUEST).json({
                message:"Error",
            })
        }
    });

    app.get("/api/v1/get-one-data/:userID", (req:Request, res:Response) :Response =>{
        try{

            const {name, course} = req.body;
            const {userID} = req.params

            const user = database.find((el: iData) => {
                return el.id === userID
            })
            return res.status(statusCode.ok).json({
                message:"Reading from database",
                data:user
            });
        } catch (error) {
            return res.status(statusCode.BAD_REQUEST).json({
                message:"Error reading from database"
            });
        }
    });

    app.post("/api/v1/create-data", (req:Request, res:Response): Response =>{
        try{
            const {name, course} = req.body
            
            const data:iData = {
                id: uuid(),
                name,
                course,
                time:moment(new Date().getTime()).format("LTS")
            }

            database.push(data)

            const dataPath = path.join(__dirname, "data", "./database.json");
            let complete:{}[] = []
             complete.push(dataPath)
            fs.writeFile(dataPath, JSON.stringify(data), ()=>{
                console.log("done writing")
            })
            return res.status(statusCode.ok).json({
                message:"Creating from database",
                data:data
            });
        } catch (error) {
            return res.status(statusCode.BAD_REQUEST).json({
                message:"Error reading from database"
            });
        }
    });

    app.patch("/api/v1/get-one-data/:userID", (req:Request, res:Response) :Response =>{
        try{

            const { course } = req.body;
            const {userID} = req.params;

            const user: iData | any = database.find((el: iData) => {
                return el.id === userID
            });

            user.course = course

            return res.status(statusCode.ok).json({
                message:"Reading from database",
                data:user
            });
        } catch (error) {
            return res.status(statusCode.BAD_REQUEST).json({
                message:"Error reading from database"
            });
        }
    });

    app.delete("/api/v1/get-one-data/: userID", (req:Request, res:Response) :Response =>{
        try{

            const { course } = req.body;
            const {userID} = req.params;

            const user: iData | any = database.find((el: iData) => {
                return el.id === userID
            });

            // user.course = course

            const newdataBase = database.filter((el:iData)=>{
                return el.id === userID
            });

            database = newdataBase

            
            return res.status(statusCode.ok).json({
                message:`${user.name} has been deleted`,
                // data:user
            });
        } catch (error) {
            return res.status(statusCode.BAD_REQUEST).json({
                message:"failed to delete user"
            });
        }
    });






/////////////////////////////////////////



    // posted
    app.post("/posted", async (req:Request, res:Response) =>{
        try{
            await client.connect();
            
             const { name,score, subject} = req.body;

             const data = new userModel( name,score, subject)

             await db.insertOne(data)

             return res.status(201).json({
                message:"user created",
                data,
             })
        } catch (error:any) {
            return res.status(404).json({
                message: "Error",
                data:error.message
            })
        }
    })
   
    // getting
    app.get("/read", async (req:Request, res:Response) =>{
        try{
             await client.connect();

             const data = await db.find({}, {}).toArray()

             return res.status(201).json({
                message:"user read",
                data,
             })
        } catch (error:any) {
            return res.status(404).json({
                message: "Error",
                data:error.message
            })
        }
    })

    // reading one
    app.get("/read-one/:userID", async (req:Request, res:Response) =>{
        try{
             await client.connect();
             const {userID} = req.params

             console.log(new ObjectId(userID))

             const data = await db.findOne({ _id:new ObjectId(userID)})

             return res.status(201).json({
                message:"user read",
                data,
             })
        } catch (error:any) {
            return res.status(404).json({
                message: "Error",
                data:error.message
            })
        }
    })


    //patch

    app.patch("/update-one/:userID", async (req:Request, res:Response) =>{
        try{
             await client.connect();
             const {score, name} = req.body
             const {userID}: any = req.params

             console.log(new ObjectId(userID))

             const data = await db.updateOne({ _id:new ObjectId(userID)},  { $set:{score, name }})

             return res.status(201).json({
                message:"user read",
                data,
             })
        } catch (error:any) {
            return res.status(404).json({
                message: "Error",
                data:error.message
            })
        }
    })

    //updatemany

    app.patch("/update-many", async (req:Request, res:Response) =>{
        try{
             await client.connect();

             const data = await db.updateMany({},  { $set:{fullTime: true}})

             return res.status(200).json({
                message:"user read",
                data,
             })
        } catch (error:any) {
            return res.status(404).json({
                message: "Error",
                data:error.message
            })
        }
    })





    //Front End Api Post;

    app.post("/data", async(req:Request, res:Response)=>{
        try{
            const {data: userData} = req.body;

            const showPath = path.join(__dirname, "data", "./database.json");

            fs.readFile(showPath, (err, data) =>{
                if (err) {
                    return err;
                } else {
                    const dataRead = JSON.parse(Buffer.from(data).toString());

                    if (lodash.some(dataRead, userData)) {
                        console.log("not Good to go...!");
                        res.status(200).json({
                            message: "Read",
                            data: dataRead,
                        });
                    } else {
                        console.log("Good to go...!");
                        dataRead.push(userData);

                        fs.writeFile(showPath, JSON.stringify(dataRead), "utf-8" , ()=>{
                            console.log("done");
                        });
                        res.status(200).json({
                            message: "Read",
                            data:dataRead,
                        })
                    };
                };
            } );
            
        } catch(error) {
           res.status(404).json({
             message:"Error",
           })
        };
    });





    
    //Front End Api Get;
 
    app.get("/reading", (req:Request, res:Response)=>{
        try{
        //   const  {data: userData} = req.body;

          const showPath = path.join(__dirname, "data", "./database.json");

          fs.readFile(showPath, (err, data)=> {
            if (err){
                return err;
            } else {
                const dataRead = JSON.parse(Buffer.from(data).toString())

                res.status(200).json({
                    message: "Read",
                    data:dataRead,
                })
            }
          });
        } catch(error){
          res.status(404).json({
            message: "Error"
          })
        };
    })


};


export default mainApp
