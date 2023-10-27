interface Data<T> {
  object: T;
}

export interface Event<T> {
  data: Data<T>;
}
