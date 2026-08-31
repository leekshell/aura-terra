import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listAllOrders, listAllSubscriptions, listUsers } from "@/lib/queries";

function toCsv(rows: Record<string, string | number>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [headers.join(";"), ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(";"))].join("\n");
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }

  const type = new URL(request.url).searchParams.get("tipo") ?? "pedidos";
  let rows: Record<string, string | number>[] = [];
  let filename = "export.csv";

  if (type === "pedidos") {
    filename = "aura-terra-pedidos.csv";
    rows = listAllOrders().map((o) => ({
      codigo: o.code,
      data: o.createdAt,
      cliente: o.customerName,
      email: o.email,
      tipo: o.kind,
      status: o.status,
      itens: o.items.map((i) => `${i.quantity}x ${i.name} (${i.weight}/${i.grind})`).join(" | "),
      subtotal: (o.subtotalCents / 100).toFixed(2),
      frete: (o.shippingCents / 100).toFixed(2),
      total: (o.totalCents / 100).toFixed(2),
      cidade: o.address.city ?? "",
      uf: o.address.state ?? "",
      cep: o.address.zip ?? "",
      rastreio: o.trackingCode ?? "",
    }));
  } else if (type === "assinantes") {
    filename = "aura-terra-assinantes.csv";
    const users = new Map(listUsers().map((u) => [u.id, u]));
    rows = listAllSubscriptions().map((s) => ({
      assinatura: s.id,
      cliente: users.get(s.userId)?.name ?? "",
      email: users.get(s.userId)?.email ?? "",
      plano: s.plan,
      status: s.status,
      frequencia: s.frequency,
      moagem: s.grind,
      peso: s.weight,
      valor: (s.priceCents / 100).toFixed(2),
      proxima_entrega: s.nextDelivery,
      cidade: s.address.city ?? "",
      uf: s.address.state ?? "",
      desde: s.createdAt,
    }));
  } else if (type === "clientes") {
    filename = "aura-terra-clientes.csv";
    rows = listUsers().map((u) => ({
      nome: u.name,
      email: u.email,
      telefone: u.phone ?? "",
      perfil: u.role,
      origem: u.provider,
      cadastro: u.createdAt,
    }));
  }

  return new NextResponse("\uFEFF" + toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
