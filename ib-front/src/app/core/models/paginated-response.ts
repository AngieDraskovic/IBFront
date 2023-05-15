export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}
