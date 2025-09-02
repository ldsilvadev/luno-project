"use server";

import path from "path";
import fs from "fs";
import transporter from "@/configs/nodemailer";

export default async function sendEmail(email: string, token: string) {
  try {
    const templatePath = path.join(
        process.cwd(),
        "src",
        "templates",
        "resetPassword.html"
    );

    const template = fs.readFileSync(templatePath, "utf-8");
    const html = template.replace(/{{TOKEN}}/g, token);

    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Redefinição de Senha - Vora",
      html,
    });

    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
