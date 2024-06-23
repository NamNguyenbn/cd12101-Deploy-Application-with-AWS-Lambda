import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todoAccess.mjs'

const todoAccess = new TodoAccess()

export async function getAllTodo() {
  return todoAccess.getAllTodo()
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()
  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    attachmentUrl: '',
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date(Date.now()).toISOString(),
    name: createTodoRequest.name,
    done: false
  })
}
export async function getTodoById(todoId) {
  return await todoAccess.getTodoById(todoId)
}
export async function updateTodo(updateTodoRequest, todoId, userId) {

    return await todoAccess.updateTodo({
      todoId: todoId,
      userId: userId,
      attachmentUrl: updateTodoRequest.attachmentUrl,
      dueDate: updateTodoRequest.dueDate,
      createdAt: updateTodoRequest.createdAt,
      name: updateTodoRequest.name,
      done: updateTodoRequest.done
    })
}
export async function updateUrl(attachmentUrl, todoId, userId) {

  return await todoAccess.updateUrl({
    todoId: todoId,
    userId: userId,
    attachmentUrl: attachmentUrl
  })
}
export async function deleteTodo(todoId, userId) {
  return todoAccess.deleteTodo(todoId, userId)
}
export async function getSignedUrl(todoId, userId) {
  return await todoAccess.getSignedUrl(todoId, userId)
}