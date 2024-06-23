
import { getUserId } from '../utils.mjs'
import { getSignedUrl } from '../../businesslogic/todos.mjs'
export async function handler(event) {
  console.log('Processing event: ', event)

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  console.log('todoId ' + todoId)
  console.log('userId ' + userId)

  return await getSignedUrl(todoId, userId)
}

