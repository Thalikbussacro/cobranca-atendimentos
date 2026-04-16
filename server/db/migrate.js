import 'dotenv/config'
import { db } from './connection.js'

const migrations = [
  // Opr_Atendimento - novos campos do relatório
  `IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Opr_Atendimento' AND COLUMN_NAME = 'Protocolo')
   ALTER TABLE Opr_Atendimento ADD Protocolo varchar(50) NULL`,

  `IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Opr_Atendimento' AND COLUMN_NAME = 'Sistema')
   ALTER TABLE Opr_Atendimento ADD Sistema varchar(100) NULL`,

  `IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Opr_Atendimento' AND COLUMN_NAME = 'TipoAtendimento')
   ALTER TABLE Opr_Atendimento ADD TipoAtendimento varchar(100) NULL`,

  `IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Opr_Atendimento' AND COLUMN_NAME = 'Departamento')
   ALTER TABLE Opr_Atendimento ADD Departamento varchar(100) NULL`,

  `IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Opr_Atendimento' AND COLUMN_NAME = 'Prioridade')
   ALTER TABLE Opr_Atendimento ADD Prioridade varchar(50) DEFAULT 'Normal'`,

  `IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Opr_Atendimento' AND COLUMN_NAME = 'Status')
   ALTER TABLE Opr_Atendimento ADD Status varchar(50) DEFAULT 'Finalizado'`,

  // Cad_Cliente - cidade
  `IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cad_Cliente' AND COLUMN_NAME = 'Cidade')
   ALTER TABLE Cad_Cliente ADD Cidade varchar(200) NULL`,
]

async function migrate() {
  console.log('Executando migrações...')

  for (const sql of migrations) {
    await db.execute(sql)
  }

  console.log(`${migrations.length} migrações executadas com sucesso.`)
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Erro na migração:', err)
  process.exit(1)
})
