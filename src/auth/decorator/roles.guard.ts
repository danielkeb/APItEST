import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '../decorator/roles.decorator';
import { Role } from './enums/role.enum';
import { AccessContorlService } from '../shared/access-control.service';

export class TokenDto {
  id: number;
  role: Role;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessContorlService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    if (!Array.isArray(requiredRoles)) {
      console.error(
        'Required roles are not iterable or not defined:',
        requiredRoles,
      );
      return false; // Return false or handle the error appropriately
    }
    console.log('required roel', requiredRoles);
    const request = context.switchToHttp().getRequest();
    const token = request['token'] as TokenDto;
    console.log(token);
    for (const role of requiredRoles) {
      const result = this.accessControlService.isAuthorized({
        requiredRole: role,
        currentRole: token.role,
      });
      console.log('result', result);
      if (result) {
        return true;
      }
    }

    return false;
  }
}
