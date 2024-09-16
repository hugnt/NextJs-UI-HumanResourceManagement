export type ApiResponse<T> = {
    metadata?: T,
    message?: string[]
    isSuccess: boolean
}
