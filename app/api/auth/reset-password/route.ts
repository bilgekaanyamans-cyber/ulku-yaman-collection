import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST: Şifre sıfırlama linki gönder
export async function POST(req: NextRequest) {
  const { email, token, newPassword } = await req.json();

  // ─── Token ile şifre sıfırlama ────────
  if (token && newPassword) {
    const record = await db.verificationToken.findFirst({
      where: { token, expires: { gt: new Date() } },
    });
    if (!record) return NextResponse.json({ error: "Geçersiz veya süresi dolmuş link" }, { status: 400 });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.user.update({
      where: { email: record.identifier },
      data: { passwordHash },
    });
    await db.verificationToken.delete({ where: { identifier_token: { identifier: record.identifier, token } } });

    return NextResponse.json({ success: true });
  }

  // ─── E-posta ile sıfırlama linki gönder ────────
  if (!email) return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });

  const user = await db.user.findUnique({ where: { email } });
  // Güvenlik: kullanıcı yoksa bile aynı yanıt (timing attack önleme)
  if (!user) return NextResponse.json({ sent: true });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 saat

  await db.verificationToken.create({
    data: { identifier: email, token: resetToken, expires },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sifremi-unuttum?token=${resetToken}&email=${email}`;

  await resend.emails.send({
    from: `Ülkü Yaman Collection <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: "Şifre Sıfırlama",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:40px">
        <h1 style="font-family:Georgia,serif;font-size:24px;text-align:center;letter-spacing:3px;margin-bottom:30px">ÜLKÜ YAMAN</h1>
        <p style="font-size:14px;color:#333;margin-bottom:20px">Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
        <a href="${resetUrl}" style="display:block;text-align:center;padding:16px;background:#1a1a1a;color:#fff;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px">Şifremi Sıfırla</a>
        <p style="font-size:12px;color:#999">Bu linkin süresi 1 saat sonra dolacaktır. Eğer şifre sıfırlama isteğinde bulunmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
      </div>
    `,
  });

  return NextResponse.json({ sent: true });
}
