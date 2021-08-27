export type SuggestionItem = {
    description: string,
    quantity: number
}
export interface ProductsSuggestions {
    id: string,
    mart_id: string,
    items: SuggestionItem[]
}
