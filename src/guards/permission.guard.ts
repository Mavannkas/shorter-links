import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/interfaces/role';
import { User } from 'src/user/entity/user.entity';
import { Response } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const permissions =
      this.reflector.get<UserRole[]>('permissions', context.getHandler()) ?? [];
    permissions.push(UserRole.Admin);

    const ctx = context.switchToHttp();
    const userId: string = ctx.getRequest().user?.user?.user_id;

    const user = await User.findOne({
      relations: ['roles'],
      where: [
        {
          user_id: userId,
        },
      ],
    });

    return permissions.some((permission) =>
      user.roles.some((item) => item.name === permission),
    );
  }
}
