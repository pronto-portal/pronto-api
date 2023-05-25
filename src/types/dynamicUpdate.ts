export interface DynamicUpdate {
  [key: string]:
    | boolean
    | undefined
    | null
    | Record<string, Record<string, string | number>>;
}
