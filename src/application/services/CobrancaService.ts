import { CreateCobrancaUseCase } from '@/application/use-cases/CreateCobrancaUseCase'
import { GetCobrancasUseCase } from '@/application/use-cases/GetCobrancasUseCase'
import { CobrancaRepositoryMock } from '@/infrastructure/repositories/CobrancaRepositoryMock'

// Dependency Injection Container (simples)
const cobrancaRepository = new CobrancaRepositoryMock()

export const cobrancaService = {
  getCobrancas: new GetCobrancasUseCase(cobrancaRepository),
  createCobranca: new CreateCobrancaUseCase(cobrancaRepository),
}
