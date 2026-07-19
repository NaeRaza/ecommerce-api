import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import crypto from 'crypto';

@Injectable()
export class AuthService {
  // Étape 1 — Injecte PrismaService et JwtService dans le constructor
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // Étape 2 — register(email, password) :
  //           - hashe le password avec bcryptjs
  //           - crée l'utilisateur en DB
  //           - retourne l'utilisateur créé
  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await this.mailService.sendWelcome(name, email);

    const {
      password: _,
      resetToken: __,
      resetTokenExpiry: ___,
      ...result
    } = user;
    return result;
  }
  // Étape 3 — login(email, password) :
  //           - trouve l'utilisateur par email
  //           - vérifie le password avec bcryptjs
  //           - génère et retourne un token JWT
  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Email incorrect');
    }
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email incorrect');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);

    await this.prismaService.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    await this.mailService.sendResetPassword(email, user.name, token);

    return { message: 'Un email de réinitialisation a été envoyé' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Étape 1 — Trouver l'utilisateur par resetToken

    const user = await this.prismaService.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Token invalide');
    }

    // Étape 2 — Vérifier que le token n'est pas expiré

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new UnauthorizedException('Token expiré');
    }
    // Si expiré → lancer une exception

    // Étape 3 — Hasher le nouveau password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Étape 4 — Mettre à jour le password et effacer le token
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    const {
      password: _,
      resetToken: __,
      resetTokenExpiry: ___,
      ...result
    } = user;

    return result;

    //           resetToken: null, resetTokenExpiry: null
  }
}
