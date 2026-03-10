export interface FinderRepository<E, T> {
  findById(id: E): Promise<T | null>;
  findAll(): Promise<T[]>;
}
