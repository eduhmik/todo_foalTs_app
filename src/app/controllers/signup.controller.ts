// 3p
import { Context, HttpResponseRedirect, logIn, Post, ValidateBody } from '@foal/core';
import { isCommon } from '@foal/password';
import { getRepository } from 'typeorm';

// App
import { User } from '../entities';

export class SignupController {

  @Post()
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  async signup(ctx: Context) {
    // Check that the password is not too common.
    if (await isCommon(ctx.request.body.password)) {
      return new HttpResponseRedirect('/signup?password_too_common=true');
    }

    // Check that no user has already signed up with this email.
    let user = await getRepository(User).findOne({ email: ctx.request.body.email });
    if (user) {
      return new HttpResponseRedirect('/signup?email_already_taken=true');
    }

    // Create the user.
    user = new User();
    user.email = ctx.request.body.email;
    await user.setPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    // send the verification email
    this.sendMail(ctx.request.body.email)
    // Log the user in.
    logIn(ctx, user);

    // Redirect the user to her/his to-do list.
    return new HttpResponseRedirect('/');
  }

  async sendMail(email) {
    // using SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'devjacetech@gmail.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);
  }

}
