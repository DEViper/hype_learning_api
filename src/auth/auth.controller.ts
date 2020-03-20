import {
    Controller,
    UseGuards,
    HttpStatus,
    Response,
    Post,
    Body,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  import { AuthService } from './auth.service';
  import { UsersService } from 'src/users/users.service';
  import { CreateUserDto } from '../users/dto/create-user.dto';
  import { LoginUserDto } from '../users/dto/login-user.dto';
  import { AuthGuard } from '@nestjs/passport';
  
  @ApiTags('auth')
  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService,
    ) {}
  
    @Post('register')
    public async register(@Response() res, @Body() createUserDto: CreateUserDto) {
      const result = await this.authService.register(createUserDto);
      if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      return res.status(HttpStatus.OK).json(result);
    }
  
     @UseGuards(AuthGuard('local'))
    @Post('login')
    public async login(@Response() res, @Body() login: LoginUserDto) {
      const user = await this.usersService.findByEmail(login.email);
      if (!user) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'User Not Found',
        });
      } else {
        const token = this.authService.createToken(user);
        return res.status(HttpStatus.OK).json(token);
      }
    }
  }