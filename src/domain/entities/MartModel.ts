export interface MartAnnex {
    id:string,
    mart_id:string,
    name: string,
    contentType: string
}

export interface MartModel {
    id: string,
    name: string
    email:string,
    phone: string,
    cnpj_cpf: string,
    password: string,
    transfer_allowed: boolean,
    image: string,
    address_id:string,
    financial_email:string,
    responsible_name:string,
    corporate_name:string,
    obs:string,
    // - annex
}


//enviar documentos  [pdf or some image] // referente a autentificaçã de pessoa juridica ou fisica ( opcional)
//
//aceitar autorização de emvio das inforçãos de infprmaçoes cedidas

//