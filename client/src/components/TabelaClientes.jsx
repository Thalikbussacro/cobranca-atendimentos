import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function TabelaClientes({ clientes }) {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table className="min-w-[500px]">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[60px]">Cód.</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">CNPJ</TableHead>
            <TableHead className="hidden lg:table-cell">E-mail</TableHead>
            <TableHead className="hidden lg:table-cell">Telefone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 md:py-8 text-muted-foreground text-sm"
              >
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            clientes.map((cliente) => (
              <TableRow key={cliente.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-so-blue text-xs md:text-sm">
                  #{cliente.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{cliente.nome}</div>
                  <div className="text-xs text-muted-foreground md:hidden mt-0.5">
                    {cliente.cnpj}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell text-sm">
                  {cliente.cnpj}
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell text-sm">
                  {cliente.email}
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell text-sm">
                  {cliente.telefone}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
