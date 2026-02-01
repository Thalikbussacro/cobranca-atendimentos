import { CreateCobrancaUseCase } from '@/application/use-cases/CreateCobrancaUseCase'
import { GetCobrancasUseCase } from '@/application/use-cases/GetCobrancasUseCase'
import { CobrancaRepositorySQL } from '@/infrastructure/repositories/CobrancaRepositorySQL'

// Dependency Injection Container (simples)
const cobrancaRepository = new CobrancaRepositorySQL()

export const cobrancaService = {
  getCobrancas: new GetCobrancasUseCase(cobrancaRepository),
  createCobranca: new CreateCobrancaUseCase(cobrancaRepository),
}
