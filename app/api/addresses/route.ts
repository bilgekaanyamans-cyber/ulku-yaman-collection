import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  const addresses = await db.address.findMany({ where: { userId: (session.user as any).id }, orderBy: { isDefault: "desc" } });
  return NextResponse.json(addresses);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  const body = await req.json();
  const address = await db.address.create({
    data: { userId: (session.user as any).id, title: body.title || "Adres", firstName: body.firstName, lastName: body.lastName, phone: body.phone, address: body.address, city: body.city, district: body.district || "", zipCode: body.zipCode || "" },
  });
  return NextResponse.json(address, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  const { addressId } = await req.json();
  await db.address.delete({ where: { id: addressId, userId: (session.user as any).id } });
  return NextResponse.json({ deleted: true });
}
