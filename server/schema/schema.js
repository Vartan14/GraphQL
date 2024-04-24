const graphql = require("graphql");
const { GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull} = graphql;

// Models
const Post = require("../models/post");
const Author = require("../models/author");


// GraphQL Schema
const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId);
            }
        }
    }),
});


const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
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
            args: { id: { type: GraphQLID } },
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

// Root Mutation
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: {type: new GraphQLNonNull(GraphQLInt) },
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
                title: { type: new GraphQLNonNull(GraphQLString) },
                text: { type: new GraphQLNonNull(GraphQLString) },
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
        },

        updateAuthor: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID},
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: {type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
               return Author.findByIdAndUpdate(
                   args.id,
                   { $set: { name: args.name, age: args.age } },
                   { new: true }
                   );
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: GraphQLID},
                title: { type: new GraphQLNonNull(GraphQLString) },
                text: {type: new GraphQLNonNull(GraphQLString) },
                authorId: {type: GraphQLID},
            },
            resolve(parent, args) {
               return Post.findByIdAndUpdate(
                   args.id,
                   { $set: { title: args.title, text: args.text, authorId: args.authorId } },
                   { new: true }
                   );
            }
        },
        deleteAuthor: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Author.findByIdAndDelete(args.id);
            }
        },
        deletePost: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findByIdAndDelete(args.id);
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});