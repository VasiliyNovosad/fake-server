const { getChats, getMessages } = require('../lib/utils');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const ChatType = new GraphQLObjectType({
  name: 'Chat',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    messages: {
      type: new GraphQLList(MessageType),
      resolve (parent, args) {
        return getMessages().then(messages => messages.filter(message => message.chat_id === parent.id));
      }
    }
  })
});

const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    created_at: { type: GraphQLString },
    // age: { type: GraphQLInt },
    chat: {
      type: ChatType,
      resolve (parent, args) {
        return getChats().then(chats => chats.find(chat => chat.id === parent.chat_id));
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    chat: {
      type: ChatType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        return getChats().then(chats => chats.find(chat => chat.id == args.id));
      }
    },
    message: {
      type: MessageType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        return getMessages().then(messages => messages.find(message => message.id == args.id));
      }
    },
    chats: {
      type: new GraphQLList(ChatType),
      resolve (parent, args) {
        return getChats();
      }
    },
    messages: {
      type: new GraphQLList(MessageType),
      resolve (parent, args) {
        return getMessages();
      }
    }
  }
});

// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     addAuthor: {
//       type: AuthorType,
//       args: {
//         name: { type: GraphQLString },
//         age: { type: GraphQLInt }
//       },
//       resolve(parent, args){
//         let author = new Author({
//           name: args.name,
//           age: args.age
//         });
//         return author.save();
//       }
//     },
//     addBook: {
//       type: BookType,
//       args: {
//         name: { type: new GraphQLNonNull(GraphQLString) },
//         genre: { type: new GraphQLNonNull(GraphQLString) },
//         authorId: { type: new GraphQLNonNull(GraphQLID) }
//       },
//       resolve(parent, args){
//         let book = new Book({
//           name: args.name,
//           genre: args.genre,
//           authorId: args.authorId
//         });
//         return book.save();
//       }
//     }
//   }
// });

module.exports = new GraphQLSchema({
  query: RootQuery
});
