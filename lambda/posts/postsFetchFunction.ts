import Database from 'opt/nodejs/infra/connection'; 
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { PostController } from './application/posts/controllers/PostController'; 


const database = new Database({
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASS!,
    collection: process.env.DATABASE_NAME!,
})
const postController = new PostController()


export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const lambdaRequestId = context.awsRequestId
    const apiRequestId = event.requestContext.requestId
    const method = event.httpMethod
    await database.connect()
    
    console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`)

    
    if (method === "GET") {
        if (event.resource === "/posts") {
            
            try {            
                return {
                    statusCode: 200,
                    body: await postController.readAll()
                }
            } catch (error) {
                console.error((<Error>error).message)
                return {
                    statusCode: 404,
                    body: (<Error>error).message
                }
            }
        }

        else if (event.resource === "posts/{slug}") {
            const slug = event.pathParameters!.slug as string
    
            try {    
                return {
                    statusCode: 200,
                    body: await postController.readOne(slug)
                }
            } catch (error) {
                console.error((<Error>error).message)
                return {
                    statusCode: 404,
                    body: (<Error>error).message
                }
            }
        }
    } 
    

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Bad request"
        })
    }
}
