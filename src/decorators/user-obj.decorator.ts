import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { executionAsyncId } from 'async_hooks';

export const UserObj = createParamDecorator(
  (data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user?.user;
  },
);
