class ApiError extends Error{
    constructor(
        statusCode,
        message= "Somethhing went wrong",
        errors = [],
        statck = ""
    ){
        super(message)
        this.statusCode= statusCode
        this.data= null
        this.errors= errors
        this.message = message
        this.success = this.success
        if(statck){
            this.statck= statck

        }else{
            Error.captureStackTrace(this, this.constructor)

        }

    }
}

export {ApiError}