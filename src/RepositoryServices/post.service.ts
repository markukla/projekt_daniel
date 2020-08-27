import * as express from 'express';
import {getRepository, Repository} from "typeorm";
import Post from "../Models/post.entity";
import CreatePostDto from "../Models/post.dto";
import PostNotFoundException from "../Exceptions/PostNotFoundException";
import Service from "../interfaces/service.interface";

class PostService implements Service<Post>{
    public repository:Repository<Post>=getRepository(Post);

    public createPost = async (request: express.Request, response: express.Response) => {
        const postData: CreatePostDto = request.body;
        const newPost = this.repository.create(postData);
        await this.repository.save(newPost);
        response.send(newPost);
    }

    public getAllPosts = async (request: express.Request, response: express.Response) => {
        const posts = await this.repository.find();
        response.send(posts);
    }

  public getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const post = await this.repository.findOne(id);
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const postData: Post = request.body;
        await this.repository.update(id, postData);
        const updatedPost = await this.repository.findOne(id);
        if (updatedPost) {
            response.send(updatedPost);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.repository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default PostService;


