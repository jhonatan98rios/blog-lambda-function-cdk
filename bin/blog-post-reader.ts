import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PostsAppStack } from '../lib/postsApp-stack';
import { BlogApiStack } from '../lib/blogApi-stack';
import { PostsAppLayersStack } from '../lib/postsAppLayers-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "757165215724",
  region: "us-east-1"
}

const tags = {
  cost: "Blog",
  team: "Jonas DEV"
}

const postsAppLayersStack = new PostsAppLayersStack(app, "PostsAppLayers", {
  tags, env
})

const postsAppStack = new PostsAppStack(app, "PostsApp", {
  tags, env
})

postsAppStack.addDependency(postsAppLayersStack)

const blogApiStack = new BlogApiStack(app, "BlogApi", {
  postsFetchHandler: postsAppStack.postsFetchHandler,
  tags, env
})

blogApiStack.addDependency(postsAppStack)