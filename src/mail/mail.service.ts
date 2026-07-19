import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendWelcome(name: string, email: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Activation du compte client',
      html: `
      <h1>Bienvenue sur notre boutique !</h1>
      <p>Bonjour ${name}, ton compte a bien été créé.</p>
      <p>Tu peux maintenant te connecter et passer des commandes.</p>
      <p>Bonne journée.</p>
      <p>L'équipe Imertia</p>
      `,
    });
  }

  async sendOrderConfirmed(email: string, orderId: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Confirmation de votre commande',
      html: `
        <p>Bonjour,</p>
        <p>Bonne nouvelle ! Votre commande ${orderId} a bien été confirmée.</p>
        <p>Nous préparons votre colis et vous tiendrons informé de son expédition.</p>
        <p>Merci pour votre achat et à bientôt sur notre boutique !</p>
        <p>L'équipe Imertia</p>
        `,
    });
  }

  async sendResetPassword(email: string, name: string, token: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Bonjour ${name},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Voici votre token de réinitialisation : <br> ${token}</p>
        <p>Ce token expire dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <p>L'équipe Imertia</p>
        `,
    });
  }
}
