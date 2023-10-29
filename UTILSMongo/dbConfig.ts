import { MongoClient } from "mongodb";

const URL: string = "mongodb://127.0.0.1:27017";

export const client = new MongoClient(URL)

const mainConnection = async () =>{
    await client.connect();

    return "Database has been connected ...";
    
};

mainConnection()
   .then((res)=>console.log(res))
   .catch(()=>console.error)
   .finally(() =>{
    client.close()
   })

   export const db = client.db("set08B").collection("student")