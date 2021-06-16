import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TokenObj = createParamDecorator(
  (data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user?.token;
  },
);
