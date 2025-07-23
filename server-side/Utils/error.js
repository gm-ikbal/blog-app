
//helper function to manage error in better way
export const errorHandler = ((statusCode , message) => {
const error = new Error()
error.statusCode = statusCode
error.message=message
return error
})