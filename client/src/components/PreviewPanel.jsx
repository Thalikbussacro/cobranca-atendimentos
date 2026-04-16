export function PreviewPanel({ preview }) {
  if (preview === null) return null

  if (preview.length === 0) {
    return (
      <div className="mt-2">
        <p className="text-sm text-muted-foreground">
          Nenhum atendimento encontrado no período selecionado.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {preview.length} cliente(s) com atendimentos no período:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {preview.map((item) => (
            <div
              key={item.clienteId}
              className="border rounded-md p-3 bg-muted/20"
            >
              <p className="font-medium text-sm">{item.clienteNome}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.atendimentos} atendimento(s) — {item.tempo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
