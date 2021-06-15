import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { executionAsyncId } from 'async_hooks';

export const TokenObj = createParamDecorator(
  (data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user?.token;
  },
);
