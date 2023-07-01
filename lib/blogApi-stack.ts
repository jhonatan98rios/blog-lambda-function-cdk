import * as cdk from 'aws-cdk-lib'
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cwlogs from 'aws-cdk-lib/aws-logs'

interface BlogApiStackProps extends cdk.StackProps {
    postsFetchHandler: lambdaNodeJS.NodejsFunction
}

export class BlogApiStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: BlogApiStackProps) {
        super(scope, id, props)

        const logGroup = new cwlogs.LogGroup(this, "BlogApiLogs")
        const api = new apigateway.RestApi(this, "BlogApi", {
            restApiName: "BlogApi",
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        })

        const postsFetchIntegration = new apigateway.LambdaIntegration(props.postsFetchHandler)

        /* Route /posts */
        const postsResource = api.root.addResource("posts")
        postsResource.addMethod("GET", postsFetchIntegration)

        /* GET /posts/{slug} */
        const postsSlugResource = postsResource.addResource("{slug}")
        postsSlugResource.addMethod("GET", postsFetchIntegration)
    }
}