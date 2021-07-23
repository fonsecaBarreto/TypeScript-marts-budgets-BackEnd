import { DatabaseAdapter } from '../domain/vendors/DatabaseAdapter'
import knex, { Knex } from 'knex'
const knexfile = require("../../knexfile")


export default class KnexAdapter implements DatabaseAdapter {

    static connection: Knex;
    static env: string = 'test';
    readonly table: string;

    static async resetMigrations(): Promise<void> {
        await KnexAdapter.connection.migrate.rollback()
        await KnexAdapter.connection.migrate.latest()
    }

    static async open(env: string): Promise<void> {
        KnexAdapter.env = env
        KnexAdapter.connection = knex(knexfile[KnexAdapter.env]) 
    }

    static async close(): Promise<void> {
        await KnexAdapter.connection.destroy()
        KnexAdapter.connection = null
    }

    constructor(table:string){
        KnexAdapter.connection = knex(knexfile[KnexAdapter.env]) 
        this.table = table
    }

    async remove( where: Object): Promise<any> {
        return KnexAdapter.connection(this.table).where(where).del()
    }
    
    async count(where: Object, key: string): Promise<number> {
        const result = await KnexAdapter.connection(this.table).where(where || {}).count(key, {as: 'count'}).first();
        if(!result) return 0
        return Number(result.count)
    }

    async find(where: object, select?: string[]): Promise<any> {
        return KnexAdapter.connection(this.table).where(where).select(select || []).first()
    }

    async list(where: object, select?: string[], order?: string, limit?: number): Promise<any> {
        if(order){
            return KnexAdapter.connection(this.table).where(where || {}).select(select || [])
                .orderBy(order,"desc").limit(limit || 10000);
        }else{
            return KnexAdapter.connection(this.table).where(where || {}).select(select || [])
        }   
    }

    async insert( data: any): Promise<any> {
        const created_at = new Date()
        const updated_at = created_at
        return await KnexAdapter.connection(this.table).insert({ ...data, created_at, updated_at})
    }

    async update( where: object, data: object): Promise<any> {
        const updated_at = new Date()
        return await KnexAdapter.connection(this.table).where(where).update({ ...data, updated_at })
    }

}