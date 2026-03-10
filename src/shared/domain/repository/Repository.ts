export interface Repository<T> {
  save(entity: T): Promise<void>;
  deleteById(id: string): Promise<void>;
}
