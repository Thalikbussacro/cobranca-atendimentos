import 'dotenv/config'
import { db, sql } from './connection.js'

const clientes = [
  { id: 1, nome: 'Pecuaria Boa Vista', cnpj: '12.345.678/0001-01' },
  { id: 2, nome: 'Granja Sao Jorge', cnpj: '23.456.789/0001-02' },
  { id: 3, nome: 'Nutricao Animal Vale Verde', cnpj: '34.567.890/0001-03' },
  { id: 4, nome: 'Racao Premium Sul', cnpj: '45.678.901/0001-04' },
  { id: 5, nome: 'Agropecuaria Serra Dourada', cnpj: '56.789.012/0001-05' },
  { id: 6, nome: 'Fabrica de Racao Tres Rios', cnpj: '67.890.123/0001-06' },
  { id: 7, nome: 'Cooperativa Agroindustrial Oeste', cnpj: '78.901.234/0001-07' },
  { id: 8, nome: 'Suinocultura Santa Clara', cnpj: '89.012.345/0001-08' },
  { id: 9, nome: 'Avicultura Planalto', cnpj: '90.123.456/0001-09' },
  { id: 10, nome: 'Confinamento Boi Gordo', cnpj: '01.234.567/0001-10' },
]

const solicitantes = [
  'Carlos Eduardo', 'Fernanda Oliveira', 'Rafael Mendes', 'Juliana Pereira',
  'Marcos Antônio', 'Patrícia Souza', 'Anderson Lima', 'Camila Ribeiro',
  'Roberto Nascimento', 'Luciana Alves', 'Diego Ferreira', 'Tatiane Costa',
  'João Pedro', 'Mariana Campos', 'Gustavo Henrique', 'Adriana Martins',
]

const problemas = [
  'O sistema de pesagem automatica da linha de producao parou de registrar os valores corretamente no banco de dados. Toda vez que um lote de racao e pesado na balanca, o valor aparece zerado no relatorio de producao, mesmo que o display da balanca mostre o peso correto. Isso esta impactando diretamente o controle de producao porque nao temos como saber quanto foi produzido em cada turno. O problema comecou ontem apos uma queda de energia que afetou o servidor onde o sistema esta instalado. Ja tentamos reiniciar o servico do sistema e a propria balanca, mas o problema persiste. Precisamos resolver com urgencia porque a fabrica esta operando sem controle de pesagem ha mais de 24 horas.',

  'Estamos com um problema grave na emissao de notas fiscais eletronicas. Quando tentamos gerar a NF-e para vendas de racao ensacada, o sistema retorna o erro "Rejeicao 539 - Duplicidade de NF-e" mesmo que a nota ainda nao tenha sido emitida anteriormente. Isso comecou a acontecer depois que fizemos a atualizacao do certificado digital da empresa na semana passada. Todas as vendas do dia estao paradas porque nao conseguimos faturar nenhum pedido. Os caminhoes estao carregados no patio esperando a liberacao das notas para poder sair para entrega. O financeiro esta cobrando uma solucao urgente porque sao mais de 15 pedidos represados.',

  'O modulo de controle de estoque de materias-primas esta apresentando divergencias significativas entre o saldo fisico e o saldo do sistema. Fizemos um inventario parcial no deposito de milho e farelo de soja e encontramos diferencas de mais de 5 toneladas em alguns itens. Suspeitamos que o problema esteja na integracao entre o sistema de recebimento e o modulo de estoque, porque as notas de entrada estao sendo lancadas corretamente mas os saldos nao estao sendo atualizados. Isso pode ter comecado apos a ultima atualizacao que fizeram no sistema ha cerca de duas semanas. Precisamos identificar a origem da divergencia antes do fechamento mensal que acontece na proxima segunda-feira.',

  'A impressora de etiquetas da linha de ensaque parou de comunicar com o sistema. Quando o operador tenta imprimir a etiqueta de identificacao do lote de racao, aparece a mensagem "Erro de comunicacao com o dispositivo" e a etiqueta nao sai. Ja verificamos os cabos e a impressora funciona normalmente quando fazemos um teste direto pela propria impressora. O problema parece ser na configuracao de porta serial do sistema porque recentemente trocamos a impressora por um modelo mais novo. A producao esta tendo que escrever as etiquetas manualmente, o que alem de ser lento, aumenta o risco de erro na identificacao dos lotes.',

  'O relatorio de custo de producao por formula de racao esta calculando os valores de forma incorreta. O custo unitario por quilo de racao produzida esta vindo muito abaixo do que deveria ser, e percebemos que o sistema nao esta considerando os custos de energia eletrica e mao de obra no rateio. Esse relatorio e fundamental para a formacao de preco de venda e estamos com receio de estar vendendo racao abaixo do custo real. A diretoria pediu uma reuniao para amanha de manha e preciso apresentar os numeros corretos. O problema pode estar na configuracao dos centros de custo ou nas formulas de rateio que foram cadastradas quando o sistema foi implantado.',

  'O sistema de formulacao de racao esta com problemas no calculo da quantidade de premix vitaminico. Quando o nutricionista cadastra uma nova formula e inclui o premix, o sistema calcula uma quantidade muito superior ao que deveria ser utilizado, as vezes chegando a 10 vezes o valor correto. Isso e perigoso porque se a producao seguir a formula errada, o lote inteiro de racao pode ficar com excesso de vitaminas e ter que ser descartado. Ja verificamos se o cadastro do produto esta correto e aparentemente a unidade de medida e a concentracao estao certas. Pode ser um problema na rotina de calculo proporcional da formula.',

  'O painel de acompanhamento de producao em tempo real nao esta atualizando. O dashboard que fica no televisor da sala de controle da fabrica esta congelado desde ontem mostrando os dados do turno anterior. Os supervisores dependem dessa tela para acompanhar a producao de cada linha e tomar decisoes sobre troca de formula e paradas programadas. Ja tentamos atualizar a pagina no navegador e limpar o cache, mas o problema parece ser no backend porque a API nao esta retornando dados novos. O servico do sistema esta rodando normalmente e os operadores conseguem registrar a producao, entao o problema parece ser especifico da consulta que alimenta o dashboard.',

  'Estamos recebendo reclamacoes de clientes sobre boletos vencidos que continuam sendo cobrados mesmo apos o pagamento. O modulo financeiro nao esta dando baixa automatica nos titulos quando recebemos o arquivo de retorno bancario. O arquivo esta sendo importado sem erros aparentes, mas os boletos permanecem com status "em aberto" no sistema. Ja conferi manualmente alguns registros e os pagamentos constam no extrato bancario. O problema esta afetando a relacao com nossos clientes mais antigos que estao recebendo ligacoes de cobranca indevida. O banco informou que o layout do arquivo de retorno foi atualizado no mes passado, pode ser que o sistema nao esteja interpretando o novo formato.',

  'O cadastro de novos produtos de racao esta impedindo a gravacao quando tentamos incluir mais de 20 ingredientes na composicao. O sistema trava, exibe uma tela branca e apos alguns segundos mostra a mensagem "Request timeout". Nossas formulas mais complexas de racao para aves de postura chegam a ter 25 ou 30 ingredientes diferentes, e nao conseguimos cadastra-las. Esse problema nao existia antes porque nossas formulas antigas tinham menos ingredientes, mas agora o nutricionista desenvolveu novas formulas mais completas e precisamos cadastra-las no sistema para iniciar a producao. O prazo para comecar a produzir a nova linha e semana que vem.',

  'O modulo de expedicao esta gerando ordens de carregamento com a sequencia de entrega errada. O sistema deveria otimizar a rota de entrega considerando a localizacao dos clientes, mas esta colocando entregas distantes no inicio da rota e entregas proximas no final. Isso esta gerando um custo adicional de combustivel significativo e os motoristas estao reclamando que as rotas nao fazem sentido. O problema comecou quando cadastramos novos clientes na regiao norte do estado e parece que o calculo de distancia esta usando coordenadas geograficas incorretas ou invertidas para esses novos enderecos.',

  'Nao estamos conseguindo emitir o Certificado de Qualidade dos lotes de racao produzidos. Quando acessamos o menu de qualidade e tentamos gerar o certificado, o sistema retorna a mensagem "Dados de analise nao encontrados" mesmo que todas as analises laboratoriais do lote estejam cadastradas e aprovadas. O certificado e obrigatorio para entregas a grandes cooperativas e estamos com tres caminhoes carregados no patio aguardando a emissao do documento. Sem o certificado nao podemos despachar a mercadoria e vamos comecar a pagar diaria de estadia dos caminhoneiros a partir de amanha.',

  'O sistema de controle de silos esta indicando nivel cheio para todos os silos, mesmo os que sabemos que estao vazios ou parcialmente cheios. Os sensores de nivel parecem estar funcionando corretamente porque o tecnico de manutencao verificou os sinais eletricos e estao dentro do esperado. O problema aparenta ser na leitura que o sistema faz dos sensores, como se estivesse interpretando o sinal analogico de forma invertida ou com um offset errado. Precisamos do controle de silos funcionando porque sem ele os operadores nao sabem qual silo usar para armazenar o milho que esta chegando dos fornecedores e ja temos caminhoes na fila para descarregar.',

  'O relatorio gerencial mensal de vendas por regiao nao esta incluindo os pedidos feitos pela equipe comercial pelo aplicativo mobile. As vendas feitas pelo sistema desktop aparecem normalmente, mas todas as vendas registradas pelo app simplesmente nao constam no relatorio. Isso esta causando uma distorcao grande nos numeros porque quase 40% das nossas vendas hoje sao feitas pelo aplicativo. A reuniao de resultados com a diretoria e na proxima quarta-feira e o gerente comercial precisa dos numeros consolidados para apresentar. Precisamos entender se o problema e na integracao dos dados do app ou se e na query do relatorio que nao esta considerando a origem mobile.',
]

const solucoes = [
  'Apos analise detalhada do problema, foi identificado que a queda de energia corrompeu a tabela de configuracao de comunicacao serial entre o sistema e a balanca. O registrador de dados (datalogger) que faz a ponte entre a balanca e o banco de dados havia perdido os parametros de conexao armazenados em memoria nao-volatil. O procedimento realizado foi: primeiro, acessamos o painel de configuracao do sistema e recadastramos a porta COM3 com os parametros corretos da balanca (baudrate 9600, 8 bits de dados, sem paridade, 1 stop bit). Em seguida, reiniciamos o servico de coleta automatica de dados e fizemos um teste de pesagem com um peso padrao de 25kg para validar que os valores estavam sendo registrados. Apos confirmar que a integracao voltou a funcionar, executamos um script de reprocessamento para recuperar os registros de pesagem das ultimas 24 horas a partir do log interno da balanca, que mantem um historico proprio. Todos os dados foram recuperados e os relatorios de producao do periodo ja estao disponiveis com os valores corretos.',

  'O problema de duplicidade de NF-e foi causado pela atualizacao do certificado digital. Quando o novo certificado foi instalado, o sistema reiniciou o contador de numeracao de notas fiscais a partir do numero 1, gerando conflito com notas ja emitidas com esses numeros no ambiente da SEFAZ. A correcao envolveu os seguintes passos: acessamos a tabela de parametros fiscais do sistema e corrigimos o campo "Ultimo Numero NF-e" para o valor correto (consultado no portal da SEFAZ, que indicava a ultima nota autorizada como 45.832). Alem disso, foi necessario atualizar a serie da NF-e de 1 para 2, pois os numeros da serie 1 que foram rejeitados ficaram em um estado inconsistente na SEFAZ. Configuramos o sistema para usar a serie 2 a partir do numero 1 e realizamos testes de emissao em ambiente de homologacao antes de liberar para producao. Apos a validacao, todas as 15 notas represadas foram emitidas com sucesso em aproximadamente 40 minutos e os caminhoes foram liberados para entrega.',

  'A investigacao revelou que o problema de divergencia de estoque estava relacionado a um trigger de banco de dados que deveria atualizar automaticamente o saldo de estoque apos cada lancamento de nota de entrada. O trigger foi desabilitado acidentalmente durante a ultima atualizacao do sistema quando um script de migracao rodou um comando ALTER TABLE na tabela de movimentacoes. A solucao aplicada foi: reativamos o trigger "trg_AtualizaSaldoEstoque" no banco de dados, verificamos sua logica para garantir que estava correto, e em seguida executamos um procedure de recalculo de saldos que percorre todas as movimentacoes desde o inicio do mes e reconstroi os saldos de cada materia-prima. O recalculo processou 847 movimentacoes e ajustou os saldos de 23 itens que estavam divergentes. Geramos um relatorio comparativo antes e depois do ajuste para documentacao e controle da auditoria interna. Recomendamos que nas proximas atualizacoes seja incluida uma verificacao automatica do estado dos triggers criticos do sistema.',

  'O problema de comunicacao com a nova impressora de etiquetas foi resolvido atualizando o driver de comunicacao no sistema. A impressora antiga utilizava protocolo serial RS-232 puro, enquanto o novo modelo opera com emulacao serial sobre USB. O sistema estava tentando se comunicar usando os parametros do modelo antigo, que sao incompativeis com o novo hardware. O procedimento realizado foi: instalamos o driver especifico da nova impressora (modelo Zebra ZD421) que cria uma porta COM virtual, atualizamos no cadastro de dispositivos do sistema a porta de COM2 para COM5 (porta virtual criada pelo driver), e ajustamos o protocolo de comunicacao de "Serial Puro" para "ZPL II" que e o protocolo nativo da nova impressora. Tambem reconfiguramos o template de etiqueta para o formato ZPL, aproveitando para incluir o QR Code do lote que a impressora antiga nao suportava. Fizemos testes com 10 etiquetas consecutivas e todas foram impressas corretamente com todas as informacoes do lote.',

  'Analisando a configuracao do relatorio de custo de producao, identificamos que os centros de custo de energia eletrica (CC 500) e mao de obra (CC 600) estavam cadastrados como "inativos" no sistema. Isso fazia com que seus valores fossem ignorados no calculo de rateio. A origem do problema foi um erro na implantacao inicial: os centros de custo foram cadastrados corretamente mas nunca foram ativados para participar do rateio de producao. A correcao envolveu: ativacao dos centros de custo 500 e 600 no modulo de contabilidade, definicao dos criterios de rateio (energia rateada por kwh consumido por linha de producao, mao de obra rateada por horas trabalhadas por setor), e reprocessamento do calculo de custo dos ultimos 3 meses para ter historico comparativo. O custo por quilo de racao subiu em media 12% apos a inclusao dos custos indiretos, o que confirma que os precos de venda precisam ser revisados. Geramos o relatorio atualizado e exportamos em PDF para a reuniao da diretoria.',

  'O erro no calculo do premix vitaminico foi rastreado ate o cadastro do produto no sistema. O premix estava cadastrado com a unidade de medida "gramas" mas a concentracao de vitaminas informada na ficha tecnica do fornecedor era expressa em "miligramas por quilo". O sistema multiplicava a concentracao pela quantidade total da formula sem fazer a conversao de unidades, resultando em valores 10 vezes maiores que o correto (fator de 1000 dividido por 100 da porcentagem). A correcao foi feita em duas etapas: primeiro ajustamos o cadastro do premix para incluir o fator de conversao correto na ficha tecnica do produto, e depois atualizamos a rotina de calculo da formula para respeitar o campo "fator de conversao" que ja existia no sistema mas nao estava sendo utilizado. Recalculamos todas as formulas ativas que utilizam premix (17 formulas no total) e enviamos os resultados para o nutricionista validar. Ele confirmou que os valores agora estao corretos e compatíveis com as recomendacoes do fabricante.',

  'O problema do dashboard congelado foi identificado como um deadlock no banco de dados que travou a stored procedure responsavel por agregar os dados de producao em tempo real. A procedure "sp_DashboardProducao" executava uma consulta complexa com multiplos JOINs que conflitava com as operacoes de INSERT dos registros de producao. O deadlock nao gerava erro visivel — a procedure simplesmente ficava aguardando indefinidamente a liberacao do lock. A solucao aplicada foi: primeiro, eliminamos a sessao travada no SQL Server usando o comando KILL no SPID identificado. Em seguida, otimizamos a stored procedure adicionando a hint NOLOCK nas tabelas de leitura do dashboard, ja que para fins de monitoramento em tempo real a leitura suja (dirty read) e aceitavel e nao causa impacto no negocio. Tambem adicionamos um timeout de 30 segundos na chamada da API que alimenta o dashboard, para que em caso de travamento futuro o frontend exiba uma mensagem de "atualizando dados" em vez de ficar congelado. O dashboard voltou a funcionar normalmente apos as correcoes.',

  'Apos investigacao detalhada, confirmamos que o problema de baixa automatica de boletos esta relacionado a atualizacao do layout do arquivo de retorno bancario. O banco migrou do layout CNAB 240 versao 8.0 para a versao 10.0, que inclui novos campos e reposicionamento de alguns campos existentes. O sistema estava lendo o codigo de movimento (que indica pagamento confirmado) da posicao 15-16 do segmento T, mas na nova versao esse campo foi movido para a posicao 15-17 com um digito adicional. A correcao foi: atualizamos o parser de arquivo de retorno CNAB 240 para reconhecer a nova versao do layout, ajustando as posicoes de leitura dos campos criticos (codigo de movimento, valor pago, data de credito, e nosso numero). Apos a correcao, reimportamos todos os arquivos de retorno do mes corrente e o sistema processou corretamente 234 baixas que estavam pendentes. Geramos um comunicado para o setor de cobranca informando que os titulos foram regularizados e as ligacoes de cobranca indevida devem ser suspensas imediatamente.',

  'O timeout no cadastro de produtos com muitos ingredientes foi causado por uma limitacao na forma como o sistema salva a composicao. Para cada ingrediente, o sistema fazia uma chamada individual ao banco de dados dentro de um loop, sem usar transacao ou batch. Com 20+ ingredientes, o tempo total de gravacao ultrapassava o timeout de 30 segundos configurado na API. A solucao foi reescrever a rotina de gravacao para usar batch insert: em vez de 25 INSERTs individuais, o sistema agora monta uma unica query com todos os ingredientes e executa em uma unica transacao. O tempo de gravacao caiu de 35+ segundos para menos de 2 segundos. Tambem aumentamos o limite maximo de ingredientes por formula de 30 para 50, prevendo formulas ainda mais complexas no futuro. Testamos o cadastro com a formula mais complexa (racao postura especial com 28 ingredientes) e a gravacao foi concluida em 1.3 segundos sem nenhum erro. O nutricionista ja conseguiu cadastrar todas as novas formulas da linha.',

  'O problema das rotas de entrega invertidas foi causado por um erro no cadastro das coordenadas geograficas dos novos clientes da regiao norte. O campo de latitude e longitude no formulario de cadastro nao possuia validacao e os valores foram digitados com os sinais invertidos (latitude positiva em vez de negativa, considerando que estamos no hemisferio sul). Alem disso, dois clientes tiveram latitude e longitude trocadas entre si. A correcao envolveu: revisao e ajuste das coordenadas de todos os 8 novos clientes cadastrados recentemente, usando o Google Maps para confirmar os enderecos corretos. Tambem adicionamos uma validacao no formulario de cadastro que verifica se as coordenadas estao dentro dos limites geograficos do estado de Santa Catarina (latitude entre -25.9 e -29.4, longitude entre -48.3 e -53.8) para evitar erros futuros. Recalculamos as rotas do dia seguinte e o custo estimado de combustivel caiu 23% em relacao as rotas erradas que estavam sendo geradas.',

  'O problema na emissao do Certificado de Qualidade foi identificado na integracao entre o modulo de laboratorio e o modulo de qualidade. As analises laboratoriais estavam sendo salvas com um codigo de lote no formato novo (prefixo "LT-" seguido do numero, ex: LT-20260215001) enquanto o modulo de qualidade ainda buscava pelo formato antigo (somente o numero, ex: 20260215001). A consulta SQL que busca as analises para gerar o certificado fazia um match exato no codigo do lote, e como os formatos eram diferentes, retornava zero registros. A correcao foi atualizar a consulta do modulo de qualidade para aceitar ambos os formatos usando um LIKE com wildcard no prefixo. Apos a correcao, geramos os certificados dos tres lotes pendentes e enviamos por e-mail para as cooperativas destinatarias. Os caminhoes foram liberados para despacho no mesmo dia, sem incorrer em custo de diaria. Recomendamos uma revisao geral nos pontos de integracao entre modulos para identificar outros possiveis problemas de incompatibilidade de formato.',

  'O problema nos sensores de nivel dos silos foi causado por uma atualizacao de firmware do CLP (Controlador Logico Programavel) que alterou a escala do sinal analogico de saida. Antes da atualizacao, o sinal de 4-20mA correspondia a 0-100% do nivel do silo. Apos a atualizacao, a escala foi invertida: 4mA passou a significar 100% (cheio) e 20mA passou a significar 0% (vazio). O sistema interpretava 20mA como cheio porque era a logica anterior. A correcao foi acessar a tela de parametrizacao de sensores no sistema e inverter a escala de conversao para cada um dos 12 silos, trocando os valores de "sinal minimo" e "sinal maximo". Apos o ajuste, os niveis passaram a ser exibidos corretamente e foram validados fisicamente pela equipe de producao que conferiu visualmente o nivel de 4 silos. Tambem atualizamos o alarme de nivel alto para que dispare corretamente quando um silo atinge 95% da capacidade, evitando transbordamento durante o recebimento de graos.',

  'A ausencia das vendas mobile no relatorio gerencial foi causada por uma diferenca no campo "Origem" dos pedidos. Pedidos feitos pelo desktop gravam Origem = "DESKTOP" enquanto o app mobile grava Origem = "APP_MOBILE". O relatorio de vendas por regiao tinha um filtro hardcoded no WHERE que incluia apenas Origem = "DESKTOP", pois foi desenvolvido antes da existencia do aplicativo mobile. A correcao foi remover o filtro de origem do relatorio, incluindo todas as fontes de pedidos. Tambem adicionamos uma nova coluna "Canal de Venda" no relatorio para que a gerencia possa visualizar a distribuicao entre desktop e mobile. Reprocessamos os relatorios dos ultimos 6 meses e identificamos que as vendas pelo app representam 38% do faturamento total, confirmando a suspeita do gerente comercial. Os relatorios atualizados ja estao disponiveis no sistema e foram exportados em Excel para a apresentacao de quarta-feira.',
]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(start, end) {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  return new Date(s + Math.random() * (e - s))
}

function formatDateSQL(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}:00`
}

function gerarAtendimentos() {
  const atendimentos = []
  let codAtendimento = 1

  for (const cliente of clientes) {
    const qtd = randomInt(4, 10)

    for (let i = 0; i < qtd; i++) {
      const dataBase = randomDate('2026-01-01', '2026-03-31')
      dataBase.setHours(randomInt(7, 16))
      dataBase.setMinutes(randomInt(0, 3) * 15)
      dataBase.setSeconds(0)

      const duracaoMinutos = randomInt(2, 16) * 15 // 30min a 4h em intervalos de 15min
      const dataFim = new Date(dataBase.getTime() + duracaoMinutos * 60000)

      const cobrar = Math.random() < 0.9 ? 'SIM' : 'NAO'

      atendimentos.push({
        id: codAtendimento++,
        clienteId: cliente.id,
        dataInicio: formatDateSQL(dataBase),
        dataFim: formatDateSQL(dataFim),
        problema: problemas[randomInt(0, problemas.length - 1)],
        solucao: solucoes[randomInt(0, solucoes.length - 1)],
        solicitante: solicitantes[randomInt(0, solicitantes.length - 1)],
        cobrar,
      })
    }
  }

  return atendimentos
}

async function seed() {
  console.log('Iniciando seed...')

  await db.transaction(async (tx) => {
    // limpar tabelas na ordem correta (dependencias)
    console.log('Limpando tabelas...')
    await tx.request().query('DELETE FROM Cad_Cobranca_Item')
    await tx.request().query('DELETE FROM Cad_Cobranca')
    await tx.request().query('DELETE FROM Opr_Atendimento')
    await tx.request().query('DELETE FROM Cad_Cliente')

    // inserir clientes
    console.log('Inserindo clientes...')
    for (const c of clientes) {
      await tx.request()
        .input('id', sql.Int, c.id)
        .input('nome', sql.NVarChar, c.nome)
        .input('cnpj', sql.NVarChar, c.cnpj)
        .input('email', sql.NVarChar, 'thalikbussacro@gmail.com')
        .input('telefone', sql.NVarChar, '(49)99486398')
        .query(`
          INSERT INTO Cad_Cliente (CodCliente, Descricao, CNPJ, EMail, Telefone)
          VALUES (@id, @nome, @cnpj, @email, @telefone)
        `)
    }
    console.log(`  ${clientes.length} clientes inseridos`)

    // inserir atendimentos
    const atendimentos = gerarAtendimentos()
    console.log('Inserindo atendimentos...')
    for (const a of atendimentos) {
      await tx.request()
        .input('id', sql.Int, a.id)
        .input('clienteId', sql.Int, a.clienteId)
        .input('dataInicio', sql.NVarChar, a.dataInicio)
        .input('dataFim', sql.NVarChar, a.dataFim)
        .input('problema', sql.NVarChar, a.problema)
        .input('solucao', sql.NVarChar, a.solucao)
        .input('solicitante', sql.NVarChar, a.solicitante)
        .input('cobrar', sql.NVarChar, a.cobrar)
        .query(`
          INSERT INTO Opr_Atendimento (CodAtendimento, CodCliente, DataHoraInicial, DataHoraFinal, ProblemaRelatado, SolucaoRepassada, Solicitante, CobrarAtendimento)
          VALUES (@id, @clienteId, @dataInicio, @dataFim, @problema, @solucao, @solicitante, @cobrar)
        `)
    }
    console.log(`  ${atendimentos.length} atendimentos inseridos`)
  })

  console.log('Seed concluido com sucesso!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Erro no seed:', err)
  process.exit(1)
})
