import {ObjectId} from "mongodb"


export class userModel{
     public _id:ObjectId
     public name:string;
     public score:number;
     public subject:Array<string>;
    constructor(name:string, score:number, subject: Array<string>){
        this._id = new ObjectId()
        this.name = name;
        this.score = score;
        this.subject = subject
    }
}