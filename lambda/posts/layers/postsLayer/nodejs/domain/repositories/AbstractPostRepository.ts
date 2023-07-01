import { IPost } from "opt/nodejs/domain/Post"; 

export abstract class AbstractPostRepository {
    abstract readAll(): Promise<IPost[]>
    abstract readOne(slug: string): Promise<IPost | null>
}
