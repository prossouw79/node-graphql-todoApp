const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const _ = require('lodash');


function nextID(){
    console.log(taskStorage);
    if(!taskStorage || taskStorage.length == 0)
        return 1;

    var max = _.maxBy(taskStorage,'id').id;
    return max + 1;
}

var storagePath = './tasks.json';

var taskStorage = [];

function saveStorage(){
    fs.writeFileSync(storagePath, JSON.stringify(taskStorage) , 'utf-8'); 
}

readStorage();
function readStorage(){
    if(fs.existsSync(storagePath)){
        var r = fs.readFileSync(storagePath, 'utf-8');
        taskStorage = JSON.parse(r);
    }else{
        taskStorage = [
            {
              id: 1,
              Description: 'Get a real job :)',
              Done: true,
            }
          ];
    }
}
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.
    # This "Task" type can be used in other type declarations.
    type Task {
        id: Int
        Description: String
        Done: Boolean
    }

    input TaskInput {
        id: Int!
        Description: String
        Done: Boolean
    }

    # The "Query" type is the root of all GraphQL queries.
    type Query {
        getTasks: [Task]
        getTask(id : Int!) : Task
    }

    type Mutation {
        addTask (input: TaskInput) : [Task]
        updateTask (input: TaskInput) : Task
        deleteTask (id: Int!) : [Task]
    }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve tasks from the "tasks" array above.
const resolvers = {
  Query: {
    getTasks: () => taskStorage,
    getTask : (root, {id}) => {
        return taskStorage.filter(task => {
            return task.id === id;
        })[0]
  }
  }
,
Mutation : {
        addTask : (root, {input}) => {
            input.id = nextID();
            taskStorage.push(input);
            console.log("Adding:", input);
            saveStorage();
            return taskStorage;
        },
        updateTask :(root, {input}) => {
            console.log("Updating:", input);
            var index = taskStorage.findIndex(x => x.id === input.id);
            var element = taskStorage[index];
            taskStorage[index] = _.assign(element,input);
            saveStorage();
            return taskStorage[index];
        },
        deleteTask: (root, {id}) => {
            console.log("Deleting:", input);
            taskStorage.splice(taskStorage.findIndex(x => x.id === id), 1);
            saveStorage();
            return taskStorage;
        }
    }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});