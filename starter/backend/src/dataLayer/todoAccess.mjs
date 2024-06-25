import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todoTable = process.env.TODO_TABLE,
    todoIdIndex = process.env.IMAGE_ID_INDEX,
    s3Client = new S3Client()
  ) {
    this.documentClient = documentClient
    this.todoTable = todoTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    this.s3Client = s3Client
  }

  async getAllTodo(userId) {
    console.log('Getting all todos')

    const params = {
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const result = await this.dynamoDbClient.query(params);
    return result.Items;
  }

async getTodoById(todoId){
  console.log('todoId ' + todoId)
  const result = await this.dynamoDbClient
    .query({
      TableName: this.todoTable,
      IndexName: this.todoIdIndex,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    })
    return result;
}
  async createTodo(todo) {
    console.log(`Creating a todo with id ${todo.todoId}`)

    await this.dynamoDbClient.put({
      TableName: this.todoTable,
      Item: todo
    })

    return todo
  }

  async updateTodo(todo) {
    console.log(`Update a todo with id ${todo.todoId}`)
    console.log(`Update a todo with userId ${todo.userId}`)
    var todoId = todo.todoId;
    var userId = todo.userId
    await this.dynamoDbClient.update({
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      },      
      UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done",      ExpressionAttributeValues:{        
        ":name": todo.name,        
        ":dueDate": todo.dueDate,        
        ":done": todo.done    
      },    
      ExpressionAttributeNames: {"#name": "name"},
      ReturnValues:"UPDATED_NEW"  })
    return todo
  }
  async updateUrl(todo) {
    console.log(`updateUrl a todo with id ${todo.todoId}`)
    console.log(`updateUrl a todo with userId ${todo.userId}`)
    var todoId = todo.todoId;
    var userId = todo.userId
     //;
    await this.dynamoDbClient.update({
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      },      
      UpdateExpression: "set attachmentUrl=:attachmentUrl",      ExpressionAttributeValues:{        
        ":attachmentUrl": todo.attachmentUrl
      },    
      ReturnValues:"UPDATED_NEW"  })
    return todo
  }
 
  async deleteTodo(todoId, userId) {
    console.log(`Delete a todo with id ${todoId}`)

    await this.dynamoDbClient.delete({
      TableName: this.todoTable,
      Key: {
          todoId,
          userId
      }
  })

    return true
  }
  async getSignedUrlAccess(todoId, userId) {
    console.log(`getSignedUrlAccess a todo with id ${todoId}`)
    console.log(`getSignedUrlAccess a todo with userId ${userId}`)
    const command = new PutObjectCommand({
      Bucket: process.env.TODO_S3_BUCKET, Key: todoId
    })
    
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: parseInt(process.env.SIGNED_URL_EXPIRATION)
    })

    return url;
  }
}
