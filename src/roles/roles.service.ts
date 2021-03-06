import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import {
  DeleteRoleResponse,
  RoleExtendedResponse,
  RoleResponse,
  RolesListResponse,
} from 'src/interfaces/role';
import { AddRoleDto } from './dto/add-role.dto';
import { Role } from './entity/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
  ) {}

  async getRoles(): Promise<RolesListResponse> {
    return await (
      await Role.find({
        deleted: false,
      })
    ).map(this.prepareRoleResponse);
  }

  async addRole(addData: AddRoleDto): Promise<RoleResponse> {
    await this.checkName(addData.name);

    const role = new Role();
    role.name = addData.name;

    await role.save();

    return this.prepareRoleResponse(role);
  }

  async updateRole(id: string, addData: AddRoleDto): Promise<RoleResponse> {
    await this.checkName(addData.name);

    const role: Role = await this.getRoleByID(id);
    role.name = addData.name;

    await role.save();

    return this.prepareRoleResponse(role);
  }

  async checkName(name): Promise<void> {
    if (await Role.findOne({ name })) {
      throw new ForbiddenException('This role now exists');
    }
  }

  async getRoleByID(id: string): Promise<Role> {
    const role = await Role.findOne(
      {
        role_id: id,
        deleted: false,
      },
      {
        relations: ['users'],
      },
    );

    if (!role) {
      throw new ForbiddenException('This role not exists');
    }

    return role;
  }

  async getRoleByName(name: string): Promise<Role> {
    console.log(name);
    const role = await Role.findOne({
      name,
      deleted: false,
    });

    if (!role) {
      throw new ForbiddenException('This role not exists');
    }

    return role;
  }

  async deleteRole(id: string): Promise<DeleteRoleResponse> {
    const role: Role = await this.getRoleByID(id);
    role.name = null;
    role.deleted = true;

    await role.save();

    return {
      ok: '1',
    };
  }

  prepareRoleResponse({ name, role_id }): RoleResponse {
    return {
      role_id,
      name,
    };
  }

  prepareExtendedRoleResponse({ name, role_id, users }): RoleExtendedResponse {
    return {
      role_id,
      name,
      users: users.map(this.adminService.filterUserResponse),
    };
  }
}
