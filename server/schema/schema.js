const graphql = require("graphql");

const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList} = graphql;

const Post = require("../models/post");
const Author = require("../models/author");


// const authors = [
//     { id: "1", name: "John Doe", age: 35 }, // 6627cf4995c3e2552dcfab21
//     { id: "2", name: "Jane Smith", age: 40 }, // 6627cfa495c3e2552dcfab22
//     { id: "3", name: "Michael Johnson", age: 45 } //6627cfd895c3e2552dcfab23
// ];


// GraphQL Schema
const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        text: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Post.findById(parent.author.id);
            }
        }
    }),
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({authorId: parent.id});
            }
        }
    })
});

// Root Query
const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
        post: {
            type: PostType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return Post.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: {type: GraphQLInt },
            },
            resolve(parent, args) {
                const author = new Author({
                    name: args.name,
                    age: args.age,
                });
                return author.save();
            }
        },

         createPost: {
            type: PostType,
            args: {
                title: { type: GraphQLString },
                text: { type: GraphQLString },
                authorId: {type: GraphQLID },
            },
            resolve(parent, args) {
                const post = new Post({
                    title: args.title,
                    text: args.text,
                    authorId: args.authorId,
                });
                return post.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
  });