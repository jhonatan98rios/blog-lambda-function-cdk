import AppError from "../../../shared/errors/AppError"; 
import { IPost } from "opt/nodejs/domain/Post"; 
import { AbstractPostRepository } from "opt/nodejs/domain/AbstractPostRepository";

type ReadOnePostResponse = {
    post: IPost | null
}

export class ReadOnePostService {

    constructor(private postRepository: AbstractPostRepository) {}

    async execute(slug: string): Promise<ReadOnePostResponse> {

        try {
            const post = await this.postRepository.readOne(slug)
    
            if (!post) {
                throw new AppError('Post não encontrado', 404)
            }
    
            return { post }

        } catch (err) {
            return err as ReadOnePostResponse
        }
    }
}