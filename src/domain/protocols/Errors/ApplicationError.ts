
export default class ApplicationError extends Error{
  public readonly code = "ApplicationError"
  public readonly params: Record<string, string> 
  constructor(name:string, message:string, params?: Record<string, string>){
    super(message)
    this.message = message
    this.name = name
    this.params = params || {}
  }
}


