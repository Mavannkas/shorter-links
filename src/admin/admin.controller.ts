import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  AllUsersResponse,
  UserRedirectsResponse,
  UserResponse,
  UserRolesResponse,
  UserTokensResponse,
} from 'src/interfaces/admin';
import { AddRoleDto } from 'src/roles/dto/add-role.dto';
import { AdminService } from './admin.service';

@Controller('main/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getAllUsers(): Promise<AllUsersResponse> {
    return this.adminService.getAllUsers();
  }

  @Get('user/:id')
  getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserResponse> {
    return this.adminService.getUser(id);
  }

  @Get('user/:id/roles')
  getUserRoles(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserRolesResponse> {
    return this.adminService.getUserRoles(id);
  }

  @Post('user/:id/roles')
  addUserRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() newRole: AddRoleDto,
  ): Promise<UserRolesResponse> {
    return this.adminService.addUserRole(id, newRole);
  }

  @Delete('user/:id/roles/:roleId')
  deleteUserRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('roleId', new ParseUUIDPipe()) roleId: string,
  ): Promise<UserRolesResponse> {
    return this.adminService.deleteUserRole(id, roleId);
  }

  @Get('user/:id/tokens')
  getUserTokens(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserTokensResponse> {
    return this.adminService.getUserTokens(id);
  }

  @Delete('user/:id/tokens/:tokenId')
  deleteUserToken(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('tokenId', new ParseUUIDPipe()) tokenId: string,
  ): Promise<UserTokensResponse> {
    return this.adminService.deleteUserToken(id, tokenId);
  }

  @Get('user/:id/redirects')
  getUserRedirects(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserRedirectsResponse> {
    return this.adminService.getUserRedirects(id);
  }

  //No zarządzanie przekierowaniami
}
