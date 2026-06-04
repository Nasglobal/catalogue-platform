import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly auditService : AuditService,
  ) {}

  async create(data: Partial<User>,) {

    const user =
      this.repo.create(data);

    return this.repo.save(user);
  }

  async findByEmail(email: string) {

    return this.repo.findOne({
      where: { email },
    });
  }

  async findById(id: number) {

    return this.repo.findOne({
      where: { id },
    });
  }

  async updateLastLogin(id: number) {

    await this.repo.update(id, {
      lastLogin: new Date(),
    });
  }


  async updateRefreshToken(
  id: number,
  refreshToken: string,
   ) {

  await this.repo.update(id, {
    refreshToken,
  });
}


async findAll() {

  return this.repo.find({
    order: {
      id: 'DESC',
    },
  });
}

async deactivate(id: number) {

  await this.repo.update(id, {
    isActive: false,
  });

  return {
    success: true,
  };
}

async updateRole(
  id: number,
  role: string,
  user: any,
) {

  await this.repo.update(id, {
    role: role as any,
  });


  await this.auditService.log({

  userId: user.id,

  userEmail: user.email,

  action: 'CHANGE_ROLE',

  resource: 'USER',

  resourceId: String(id),

  metadata: {
    newRole: role,
  },
});



  return {
    success: true,
  };
}

}



