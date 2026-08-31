import { MessageToggle } from "@/components/message-toggle";
import { requireAdmin } from "@/lib/auth";
import { listMessages } from "@/lib/queries";

export default async function AdminMensagens() {
  await requireAdmin();
  const messages = listMessages();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-forest-900">Mensagens de contato</h2>
        <p className="text-sm text-forest-600">
          {messages.filter((m) => !m.handled).length} aguardando resposta de {messages.length} no total.
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-4xl border border-dashed border-areia-300 p-10 text-center text-sm text-forest-600">
          Nenhuma mensagem recebida ainda. As mensagens do formulário de contato aparecem aqui.
        </p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-4xl border border-areia-200 bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-forest-900">
                    {m.name} <span className="text-xs font-normal text-forest-500">· {m.subject}</span>
                  </p>
                  <a href={`mailto:${m.email}`} className="text-xs text-terracota-600 underline">
                    {m.email}
                  </a>
                  <p className="mt-0.5 text-xs text-forest-500">
                    {new Date(m.created_at.replace(" ", "T")).toLocaleString("pt-BR")}
                  </p>
                </div>
                <MessageToggle id={m.id} handled={!!m.handled} />
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-forest-700">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
