import { BodyValidator, ErrorsParams, SchemaRow } from '../domain/protocols/ControllerBateries'
import * as emailValidator from 'email-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator'; 


const makeMissingMessage = (field: string, missingMessage: string) =>{
  return missingMessage || `Campo '${field}' é obrigatório`
}

const makeInvalidMessage = (field: string, invalidMessage:string) =>{
  return invalidMessage || `Campo '${field}' contem valor inválido `
}

export default class JsonValidator implements BodyValidator{

  constructor(public schema: Record<string, SchemaRow>){}

  public async validate(body: Record<string, any>): Promise<ErrorsParams | null>  {

    this.sanitize(body)

    var params:ErrorsParams = {}

    Object.keys(this.schema).map( field => {

      const { type, size, optional, label, missingMessage, invalidMessage } = this.schema[field] 
      const value = body[field]

      if(type === "any") return 

      if ( value === null ){
        if(optional === true) return
        return params[field]= makeMissingMessage(label || field, missingMessage)
      } 

      let IsTypeValid = this.checkType( value, type )
      if(IsTypeValid === false) return params[field] = makeInvalidMessage(label || field, invalidMessage)
    
    })

    return Object.keys(params).length == 0 ? null : params 
  }

  private sanitize (body: Record<string,any>) {

    Object.keys(body).map( param => { // Delete all unwanted params
      if(!this.schema[param]){ delete body[param] }
    })
    var initialBody = { ...body } // clone body

    Object.keys(this.schema).forEach( field => {
      const { type } = this.schema[field]
      var value = initialBody[field]
      var final_value:any  = ( value === undefined ||  value === "" ) ? null : value;
      if(final_value == null) return body[field] = null

      switch(type){
        
        case "cnpj/cpf": final_value = (value+"").replace(/[^\d]+/g,'');break;
        case "phone":  final_value = (value+"").replace(/[^\d]+/g,''); break;
        case "number": { if(!isNaN(value)) final_value = Number(value); };break;
        case "date": if(!isNaN(Date.parse(value))) final_value = new Date(value);break;
        case "boolean": final_value = JSON.parse(value); break;
      }
      return body[field] = final_value
    })
  }

  private checkType( value:any, type:string){
    var isValid = true
    switch(type){

      case "json" :{
        try {
          JSON.parse(value);
          isValid = true;
        } catch (e) {
          isValid = false;
        }
      };break;

      case "cnpj/cpf" : {
        try{
          var ok = cpf.isValid(value)
          if(ok === false ) { ok = cnpj.isValid(value) }
          if(ok === false) isValid = false
        }catch(err){ isValid = false; }
      };break;

      case "phone" : {
          if(isNaN(value)) isValid = false
          if(value.length < 10 || value.length > 14){
            isValid = false
          }
      };break;

      case "date" : if( !(value instanceof Date) ) isValid = false ; break;
      case "email":
        try{
          const isEmailValid = emailValidator.validate(value)
          if(isEmailValid === false) isValid = false
        }catch(err){ isValid = false}
      break;
      case "array": if(Array.isArray(value) === false ) isValid = false; break;
      default: if(type !== typeof value) isValid= false; break;
    }
    return isValid
  }

}








