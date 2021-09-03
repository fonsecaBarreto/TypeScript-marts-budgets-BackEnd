export interface MartAnnex {
    id:string,
    mart_id:string,
    name: string,
    contentType: string
}

export interface MartsCheckList {
    mart_id: string,
    access_number: number,
    first_suggestions: boolean, 
    first_rating: boolean,
}

export interface MartsRating {
    id: string,
    mart_id: string,
    grade:number,
    description: string
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
}

