import { SetMetadata } from '@nestjs/common';

import { UserRole } from 'src/interfaces/role';

export const UsePermissions = (...permission: UserRole[]) =>
  SetMetadata('permissions', permission);
