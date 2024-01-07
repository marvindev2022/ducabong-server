import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  Patch,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { LoginDTO } from '@infra/http/models/User/login.dto';
import { EditPasswordDTO } from '@infra/http/models/User/editPassword.dto';
import { RegisterDTO } from '@infra/http/models/User/register.dto';
import { UserService } from '@infra/http/services/users/users.service';
import { EditDTO } from '@infra/http/models/User/edit.dto';
import { ResetPasswordDTO } from '@infra/http/models/User/resetPassword.dto';
import { DeleteUserDTO } from '@infra/http/models/User/delete.dto';
import { MissingParamError } from '@app/errors/MissingParamError';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post('registered')
  async register(@Body() registerUserDTO: RegisterDTO) {
    const id = await this.userService.register(registerUserDTO);
    
    if (id instanceof Error) throw new BadRequestException(id.message);

    return { message: 'Usuário cadastrado com sucesso!' };
  }

  @Post('login')
  async login(@Body() LoginDTO: LoginDTO) {
    const userData = await this.userService.login(LoginDTO);

    return userData;
  }

  @Post('validate/data')
  async validateEmail(@Body() { email,cpf }: { email: string ,cpf:string}) {
    if (!email) {
      throw new MissingParamError('email');
    }
    if (!cpf) {
      throw new MissingParamError('cpf');
    }
    const emailIsAvailable = await this.userService.validateData(email,cpf);

    return emailIsAvailable;
  }

  @Get(':id/find')
  async findUserById(@Param('id') id:string){
  const user = await this.userService.findUsers(id)
  return user
}
  @Patch(':id/delete')
  async deleteUserById(@Body() request:DeleteUserDTO, @Param('id') id:string){
   await this.userService.deleteUser(request,id)
  return "Usuario deletado!"
}

@Put(':id')
@UseInterceptors(FileInterceptor('photo'))
async edit(@Param('id') id: string, @Body() EditDTO: EditDTO, @UploadedFile() photoFile: Express.Multer.File) {
  
  await this.userService.edit(id, EditDTO);

  return 'Dados editados com sucesso!';
}

  @Patch(':id/password')
  async editPassword(
    @Param('id') id: string,
    @Body() request: EditPasswordDTO,
  ): Promise<string | void> {
    await this.userService.editPassword(id, request);
  }

  @Patch(':id/change-password')
  @HttpCode(201)
  async resetPassword(
    @Param('id') id: string,
    @Body() request: ResetPasswordDTO,
  ): Promise<string | Error> {
    const resetedPassword = await this.userService.resetPassword(id, request);
    return resetedPassword;
  }
}
