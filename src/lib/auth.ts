import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client";
import nodemailer from "nodemailer";
const prisma = new PrismaClient();


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // or 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
      user: "sharintasnia1@gmail.com",
      pass: process.env.APP_PASS, // must be Gmail App Password
    },
  });
  
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    trustedOrigins: [
        process.env.BETTER_AUTH_URL as string
      ],
    user: {
        additionalFields: {
           role: {
               type: "string",
               defaultValue:"USER"
             } 
         }
     },
    emailAndPassword: { 
        enabled: true, 
        autoSignIn:false,
        requireEmailVerification:true,
      }, 
      emailVerification: {
        sendOnSignUp:true,
        
        sendVerificationEmail: async ({ user, url, token }, request) => {
      
          const verificationUrl = `${process.env.BETTER_AUTH_URL}/verification_email?token=${token}`;
      
          const htmlTemplate = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <title>Email Verification</title>
              </head>
              <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:40px 0;">
                      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px;">
                        
                        <tr>
                          <td style="text-align:center;">
                            <h2 style="color:#333;">Verify your email</h2>
                          </td>
                        </tr>
      
                        <tr>
                          <td style="padding:20px 0; color:#555; font-size:15px;">
                            Hi <b>${user.email}</b>, <br/><br/>
                            Thanks for creating an account. Please verify your email address by clicking the button below.
                          </td>
                        </tr>
      
                        <tr>
                          <td align="center" style="padding:20px 0;">
                            <a href="${verificationUrl}"
                               style="
                                 background:#2563eb;
                                 color:#ffffff;
                                 text-decoration:none;
                                 padding:12px 24px;
                                 border-radius:6px;
                                 font-size:16px;
                                 display:inline-block;
                               ">
                              Verify Email
                            </a>
                          </td>
                        </tr>
      
                        <tr>
                          <td style="padding-top:20px; font-size:13px; color:#777;">
                            If you didn’t create this account, you can safely ignore this email.
                          </td>
                        </tr>
      
                        <tr>
                          <td style="padding-top:30px; font-size:12px; color:#aaa; text-align:center;">
                            © ${new Date().getFullYear()} Your App Name. All rights reserved.
                          </td>
                        </tr>
      
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `;
      
          await transporter.sendMail({
            from: '"Your App Name" <no-reply@yourapp.com>',
            to: user.email,
            subject: "Verify your email address",
            html: htmlTemplate,
          });
        },
      }
      
   
});