import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "../Models/Post/post.dto";

import Post from "../Models/Post/post.entity";
import PostService from "../RepositoryServices/postRepositoryService";


class PostsController implements Controller<Post>{
    public path = '/posts';
    public router = express.Router();
   public  service=new PostService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.service.getAllPosts);
        this.router.get(`${this.path}/:id`, this.service.getPostById);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.service.modifyPost);
        this.router.delete(`${this.path}/:id`, this.service.deletePost);
        // validationMiddleware is attached only to this route
        this.router.post(this.path,validationMiddleware(CreatePostDto), this.service.createPost);
    }


}

export default PostsController;