import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtGuard } from './jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgotPassword.dt';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  // Étape 1 — Injecte AuthService dans le constructor
  constructor(private readonly authService: AuthService) {}

  // Étape 2 — POST /auth/register : crée un utilisateur
  //           reçoit un @Body() dto: AuthDto
  @Post('/register')
  register(@Body() { name, email, password }: RegisterDto) {
    return this.authService.register(name, email, password);
  }
  // Étape 3 — POST /auth/login : connecte un utilisateur
  //           reçoit un @Body() dto: AuthDto
  //           retourne un token JWT
  @Post('/login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('/me')
  me(@Request() req) {
    return req.user;
  }

  @Post('/forgot-password')
  forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(token, newPassword);
  }
}
