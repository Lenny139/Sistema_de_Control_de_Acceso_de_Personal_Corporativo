export interface FinderRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}
