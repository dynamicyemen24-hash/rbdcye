declare module 'bcryptjs' {
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
  export function hash(password: string, salt: string | number): Promise<string>;
  export function hashSync(password: string, salt: string | number): string;
  export function compare(password: string, hash: string): Promise<boolean>;
  export function compareSync(password: string, hash: string): boolean;
  export function getRounds(hash: string): number;
  export function getSalt(hash: string): string;
}
