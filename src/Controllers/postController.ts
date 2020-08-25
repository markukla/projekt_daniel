import * as express from 'express';
import Post from "../Models/postType";
import postModel from "../Models/post"; // postModel is imported from post and it is a class. we can istatiate it or use its static methods
import Controller from 'interfaces/controller.interface';
import {NextFunction} from "express";
import PostNotFoundException from "../Exceptions/PostNotFoundException";


class PostsController implements Controller{
    public path = '/posts';
    public router = express.Router();
    private post = postModel;
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.patch(`${this.path}/:id`, this.modifyPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
        this.router.post(this.path, this.createPost);
    }

    private getAllPosts = (request: express.Request, response: express.Response) => {
        this.post.find()
            .then((posts) => {
                response.send(posts);
            });
    }

    private getPostById = (request: express.Request, response: express.Response, next:NextFunction) => {
        const id = request.params.id;
        this.post.findById(id)
            .then((post) => {
                if(post){
                    response.send(post);
                }
                else{
                    /*if post not found we create appropriate exception and send it to next middleware in the chain.
                     In that case function errorMiddleware(error:HttpException, request:Request, response:Response, next:NextFunction).
                      It use created object and request and response objects to prepare and  send response to the user(cause it is last middleware in the chain)*/
                    next(new PostNotFoundException(id));
                }



            });
    }

    private modifyPost = (request: express.Request, response: express.Response, next:NextFunction) => {
        const id = request.params.id;
        const postData: Post = request.body;
        this.post.findByIdAndUpdate(id, postData, { new: true })
            .then((post) => {
                if(post){
                    response.send(post);
                }
                else{
                    next(new PostNotFoundException(id));
                }
            });
    }

    private createPost = (request: express.Request, response: express.Response) => {
        const postData: Post = request.body;
        const createdPost = new this.post(postData);
        createdPost.save()
            .then((savedPost:Post) => {
                response.send(savedPost);
                console.log(savedPost);
            });
    }

    private deletePost = (request: express.Request, response: express.Response, next:NextFunction) => {
        const id = request.params.id;
        this.post.findByIdAndDelete(id)
            .then((successResponse) => {
                if (successResponse) {
                    response.send(200);
                } else {
                    next(new PostNotFoundException(id));
                }
            });
    }
}

export default PostsController;