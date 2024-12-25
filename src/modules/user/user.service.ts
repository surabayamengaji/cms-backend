import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-role.enum';
import { PrismaService } from 'src/common/services/prisma.service';
import * as bcrypt from 'bcrypt';
import { responseSuccess } from 'src/utils/responses';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    const result = await this.prismaService.user.findMany({
      select: {
        username: true,
        name: true,
        email: true,
        role_name: true,
      },
    });
    console.log(result);
    return responseSuccess(HttpStatus.OK, 'Get users success', result);
  }

  async createUser() {
    const hashedPassword = await bcrypt.hash('ArdhikaRN3737!', 10);
    const user = await this.prismaService.user.create({
      data: {
        email: 'ardhika@gmail.com',
        name: 'Ardhika Ryzha Nurmawan',
        username: 'ardhika',
        password: hashedPassword,
        role: {
          connect: {
            name: UserRole.SUPERADMIN,
          },
        },
      },
    });

    return 'User createdss';
  }
}
