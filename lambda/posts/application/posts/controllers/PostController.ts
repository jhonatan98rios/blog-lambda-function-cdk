import { ReadAllPostsService } from '../services/ReadAllPostsService'; 
import { ReadOnePostService } from '../services/ReadOnePostService'; 
import { MongoDBPostRepository } from 'opt/nodejs/infra/PostRepository';

export class PostController {

    public async readAll(): Promise<string> {
        const postRepository = new MongoDBPostRepository()
        const readAllPostsService = new ReadAllPostsService(postRepository)
        const posts = await readAllPostsService.execute()
        return JSON.stringify(posts)
    }

    public async readOne(slug:  string): Promise<string> {
        const postRepository = new MongoDBPostRepository()
        const readOnePostService = new ReadOnePostService(postRepository)
        const post = await readOnePostService.execute(slug)
        return JSON.stringify(post)
    }
}