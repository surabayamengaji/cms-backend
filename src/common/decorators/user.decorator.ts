import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface User {
  email: string;
  sub: number;
  iat: number;
  exp: number;
}
// createParamDecorator is a function that takes a function as an argument
export const User = createParamDecorator((_, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest();
  return request.userEmail;
});
