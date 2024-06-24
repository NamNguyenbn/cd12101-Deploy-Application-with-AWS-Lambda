
import { getUserId } from '../utils.mjs'
import { getSignedUrl, getTodoById, updateUrl } from '../../businesslogic/todos.mjs'
export async function handler(event) {
  console.log('Processing event: ', event)

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  console.log('todoId ' + todoId)
  console.log('userId ' + userId)

  // var result = await updateUrl(`https://${process.env.TODO_S3_BUCKET}.s3.amazonaws.com/${todoId}`, todoId, userId)
  // console.log('result ' + JSON.stringify(result))
  var uploadUrl = await getSignedUrl(todoId, userId)
  var result = await updateUrl(`https://${process.env.TODO_S3_BUCKET}.s3.amazonaws.com/${todoId}`,todoId, userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
   body: JSON.stringify({
    uploadUrl
    })
  }
}

