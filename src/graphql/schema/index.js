import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    scalar Date
    type Response {
        success: Boolean
    }
    type Auth {
        user: User
        token: String
    }
    type User {
        id: ID!,
        username: String!,
        email: String!,
        avatar:String,
        notes: [Note]
        createdAt: Date!
        updatedAt: Date!
    }
        type Note {
            id: ID!,
            content: String!,
            author: User!,
            createdAt: Date!,
            updatedAt: Date!
    },
        type Query {
            notes: [Note]
            note(id: ID!): Note
    },
        type Mutation {
            newNote(content: String!): Note
            updateNote(id: ID!, content: String!): Note
            deleteNote(id: ID!): Response!
            signUp(username: String!, email: String, password: String!): String!
            signIn(email: String!, password: String!): Auth!
    }
`;
