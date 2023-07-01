import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as ssm from 'aws-cdk-lib/aws-ssm'

export class PostsAppLayersStack extends cdk.Stack {
    readonly postsLayer: lambda.LayerVersion

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        this.postsLayer = new lambda.LayerVersion(this, "PostsLayer", {
            code: lambda.Code.fromAsset('lambda/posts/layers/postsLayer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            layerVersionName: "PostsLayer",
            removalPolicy: cdk.RemovalPolicy.RETAIN
        })

        new ssm.StringParameter(this, "PostsLayerVersionArn", {
            parameterName: "PostsLayerVersionArn",
            stringValue: this.postsLayer.layerVersionArn
        })
    }
}