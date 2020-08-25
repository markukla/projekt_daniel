import * as mongoose from 'mongoose';
import Post from "./postType";
// using Post interface allows to set Post as type of values which are added to Db with postModel. Postmodel works like entitymanager in Java


// shcema defines names of fields in db document, their types, and also othet parameters for validation min, max, default values etc date.now
const postSchema=new mongoose.Schema({

    author:String,
    content:String,
    title: String
    }

)
// models works as entity manager to save Post jsons in database.Thanks to using  <Post & mongoose.Document>, TypeScript is now aware of all the fields you defined in the interface and knows that it can expect them to be available in the post model.
const postModel=mongoose.model<Post & mongoose.Document>("Post",postSchema);
export default postModel;