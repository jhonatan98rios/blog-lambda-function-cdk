import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs'
import * as cdk from 'aws-cdk-lib'
import * as dotenv from 'dotenv'
import * as ssm from 'aws-cdk-lib/aws-ssm'

import { Construct } from 'constructs'


export class PostsAppStack extends cdk.Stack {

    readonly postsFetchHandler: lambdaNodeJS.NodejsFunction

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        dotenv.config()

        /* Layers */
        const postsLayerArn = ssm.StringParameter.valueForStringParameter(this, "PostsLayerVersionArn")
        const postsLayer = lambda.LayerVersion.fromLayerVersionArn(this, "PostsLayerVersionArn", postsLayerArn)

        this.postsFetchHandler = new lambdaNodeJS.NodejsFunction(
            this,
            "PostsFetchFunction",
            {
                functionName: 'PostsFetchFunction',
                entry: "lambda/posts/postsFetchFunction.ts",
                handler: "handler",
                memorySize: 128,
                timeout: cdk.Duration.seconds(5),
                bundling: {
                    minify: true,
                    sourceMap: false,
                },
                environment: {
                    DATABASE_USER: process.env.DATABASE_USER!,
                    DATABASE_PASS: process.env.DATABASE_PASS!,
                    DATABASE_NAME: process.env.DATABASE_NAME!,
                },
                layers: [postsLayer]
            }
        )
    }
}