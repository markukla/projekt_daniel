import App from './app';
import PostsController from "./Controllers/postController";


const app = new App([ new PostsController()],

    5000,
);

app.listen();