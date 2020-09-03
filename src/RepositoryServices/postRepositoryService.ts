import * as express from 'express';
import {getManager, getRepository, Repository} from "typeorm";
import Post from "../Models/Post/post.entity";
import CreatePostDto from "../Models/Post/post.dto";
import PostNotFoundException from "../Exceptions/PostNotFoundException";
import RepositoryService from "../interfaces/service.interface";

class PostService implements RepositoryService{
    public repository:Repository<Post>=getRepository(Post);
    public manager=getManager();



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
        try {
        await this.repository.update(id, postData);

            const updatedPost = await this.repository.findOne(id);
            if (updatedPost) {
                response.send(updatedPost);
            } else {
                next(new PostNotFoundException(id));
            }
        }catch (e) {
           var erroType=e.type;
           var erroMessage=e.message;
            response.send({

                "errorType":`${erroType}`,
                "errorMessage":`${erroMessage}`
            })

        }
    }

    public deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.repository.delete(id);
        console.log(deleteResponse);
        if (deleteResponse.affected===1) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default PostService;


