import { sign } from 'jsonwebtoken';
import { PrismaService } from '../prisma.service';
import { User } from '@domain/User/User';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@app/repositories/User/user';
import { LoginDTO } from '@infra/http/models/User/login.dto';
import { compareToEncrypted } from '@app/protocols/crypto/compare/compareToEncrypted';
import { EditDTO } from '@infra/http/models/User/edit.dto';

import { FindedDTO } from '@infra/http/models/User/finded.dto';

import { makeHash } from '@app/protocols/crypto/hash/makeHash';
import { DeleteUserDTO } from '@infra/http/models/User/delete.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prismaService: PrismaService) {}

  async register(user: User): Promise<string> {
    if (user instanceof Error) {
      throw new BadRequestException(user.message, {
        cause: user,
        description: user.stack,
      });
    }

    const { ...userProps } = user.props;

    const { id } = await this.prismaService.user.create({
      data: {
        ...userProps,
      },
      select: {
        id: true,
      },
    });

    return id;
  }

  async login(account: LoginDTO): Promise<any | Error> {
    const databaseStored = await this.prismaService.user.findUnique({
      where: { email: account.email },
    });
    if (databaseStored?.email && !databaseStored?.isActive)
      throw new BadRequestException('Conta está desativada!');
    if (
      !databaseStored?.password ||
      !compareToEncrypted({
        receivedString: account.password,
        encryptedString: databaseStored.password,
      })
    ) {
      return new BadRequestException('Email ou senha estão incorretos');
    }
    const { ...user } = new User({ ...databaseStored, isActive: true });
    await this.prismaService.logs.create({
      data: {
        userId: user.props.id as string,
        action: 'register',
        details: JSON.stringify(user.props),
      },
    });
    return {
      password: '',
      token: sign({ id: databaseStored.id }, process.env.JWT_SECRET as string),
      ...user,
    };
  }

  async edit(userId: string, account: EditDTO): Promise<any | Error> {
    if (!userId) {
      throw new BadRequestException('Identificação inválida');
    }

    const updatedUser = await this.prismaService.user.update({
      data: {
        name: account.name,
        email: account.email,
        password: makeHash(account.password as string),
        phone: account.phone,
        cpf: account.cpf,
      },
      where: {
        id: userId,
      },
    });

    return updatedUser;
  }

  async findUserById(id: string): Promise<any> {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!user) throw new BadRequestException('Usuário não encontrado');

    return { ...user };
  }

  async deleteUser(request: DeleteUserDTO, id: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    await this.prismaService.user.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const encryptedPassword = makeHash(newPassword);

    const userUpdated = await this.prismaService.user.update({
      where: { id },
      data: { password: encryptedPassword },
    });

    if (!userUpdated) return false;
    return true;
  }

  async findByEmail(email: string): Promise<FindedDTO | NotFoundException> {
    const databaseResponse = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!databaseResponse || Object.values(databaseResponse).length < 1) {
      return new NotFoundException('Nenhum usuário encontrado');
    }

    return databaseResponse;
  }
}
