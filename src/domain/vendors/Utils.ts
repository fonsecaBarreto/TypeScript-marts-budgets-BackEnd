export interface Hasher {
    hash(value:string): Promise<string>
    compare(value:string, hash:string): Promise<boolean>
}

export interface IdGenerator {
    generate(): Promise<string>
}

export interface PasswordGenerator {
    generate(): Promise<string>
}