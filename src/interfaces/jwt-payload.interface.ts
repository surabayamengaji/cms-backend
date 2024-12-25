export interface JwtPayload {
  email: string;
  sub: number;
  type: 'access' | 'refresh';
}
