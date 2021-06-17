import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';
import { PermissionGuard } from 'src/guards/permission.guard';
import {
  DeleteRoleResponse,
  RoleExtendedResponse,
  RoleResponse,
  RolesListResponse,
} from 'src/interfaces/role';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from './roles.service';

@Controller('main/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @UseFilters(new ForbiddenRedirectFilter())
  getRoles(): Promise<RolesListResponse> {
    return this.rolesService.getRoles();
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  addRole(@Body() addData: AddRoleDto): Promise<RoleResponse> {
    return this.rolesService.addRole(addData);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @UseFilters(new ForbiddenRedirectFilter())
  async getRole(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RoleExtendedResponse> {
    return this.rolesService.prepareExtendedRoleResponse(
      await this.rolesService.getRoleByID(id),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() addData: AddRoleDto,
  ): Promise<RoleResponse> {
    return this.rolesService.updateRole(id, addData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  deleteRole(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DeleteRoleResponse> {
    return this.rolesService.deleteRole(id);
  }
}
