import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  DeleteRoleResponse,
  RoleResponse,
  RolesListResponse,
} from 'src/interfaces/role';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from './roles.service';

@Controller('main/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('')
  getRoles(): Promise<RolesListResponse> {
    return this.rolesService.getRoles();
  }

  @Post('')
  addRole(@Body() addData: AddRoleDto): Promise<RoleResponse> {
    return this.rolesService.addRole(addData);
  }

  @Patch(':id')
  updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() addData: AddRoleDto,
  ): Promise<RoleResponse> {
    return this.rolesService.updateRole(id, addData);
  }

  @Delete(':id')
  deleteRole(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DeleteRoleResponse> {
    return this.rolesService.deleteRole(id);
  }
}
