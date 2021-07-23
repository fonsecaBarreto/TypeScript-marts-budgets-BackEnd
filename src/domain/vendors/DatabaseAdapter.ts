export interface DatabaseAdapter {
    readonly table: string
    remove( where:Object): Promise<any> 
    count (where:Object, key:string): Promise<number>
    find( where: object, select?:string[]): Promise<any>
    list( where: object, select?: string[], order?:string, limit?: number) : Promise<any>
    insert(data: any): Promise<any>
    update(where:object, data: object ): Promise<any>
}