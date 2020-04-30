import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    directive @authentication on QUERY | FIELD_DEFINITION | FIELD
    scalar Date
    type Response {
        success: Boolean
    }
    type User {
        id: ID!
        username: String!
        email: String!
        avatar:String
        notes: [Note]!
        favorites: [Note]!
        createdAt: Date!
        updatedAt: Date!
    }
    type Note {
        id: ID!
        content: String!
        author: User!
        favoritedBy: [User]!
        favoriteCount: Int!
        createdAt: Date!
        updatedAt: Date!
    }
    type Auth {
        user: User
        token: String
    }
    type NoteFeed {
        notes: [Note]!
        cursor: String!
        hasNextPage: Boolean!
    }
    type Query {
        me: User! @authentication
        user(username: String!): User
        users: [User]!
        notes: [Note]!
        note(id: ID!): Note @authentication
        noteFeed(cursor: String): NoteFeed!
    },
    type Mutation {
        newNote(content: String!): Note @authentication
        updateNote(id: ID!, content: String!): Note @authentication
        deleteNote(id: ID!): Response! @authentication
        signUp(username: String!, email: String, password: String!): String!
        signIn(email: String!, password: String!): Auth!
        toggleFavorite(id: ID!): Note! @authentication
    }
`;
