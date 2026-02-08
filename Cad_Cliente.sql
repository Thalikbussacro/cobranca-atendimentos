USE [SigaSoel]
GO

/****** Object:  Table [dbo].[Cad_Cliente]    Script Date: 02/02/2026 14:54:37 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Cad_Cliente](
	[ID] [int] NOT NULL,
	[CodCliente] [int] NOT NULL,
	[CodIntCliente] [int] NOT NULL,
	[Descricao] [varchar](100) NULL,
	[RazaoSocial] [varchar](100) NULL,
	[CNPJ] [varchar](25) NULL,
	[CodMunicipio] [int] NULL,
	[Endereco] [varchar](100) NULL,
	[Cep] [varchar](10) NULL,
	[EMail] [varchar](100) NULL,
	[Contato] [varchar](50) NULL,
	[Telefone] [varchar](25) NULL,
	[Status] [varchar](10) NULL,
	[ServidorOPC] [varchar](100) NULL,
	[Sistema] [varchar](30) NULL,
	[VersaoSigaFran] [varchar](30) NULL,
	[VersaoBancoDados] [varchar](30) NULL,
	[VersaoSQLServer] [varchar](30) NULL,
	[VersaoTIA] [varchar](30) NULL,
	[VersaoE3] [varchar](30) NULL,
	[TagsE3] [int] NULL,
	[Observacao] [varchar](500) NULL,
	[Usuario] [int] NULL,
	[DtModificacao] [datetime] NULL,
	[CodClienteOrc] [int] NULL,
	[CodEmpresa] [int] NULL,
	[IntegracaoTXT] [varchar](3) NULL,
	[IntegracaoBanco] [varchar](3) NULL,
	[IntegracaoWebService] [varchar](3) NULL,
	[ModuloGerCadastros] [varchar](3) NULL,
	[ModuloGerGeral] [varchar](3) NULL,
	[ModuloGerParametros] [varchar](3) NULL,
	[ModuloGerConfiguracao] [varchar](3) NULL,
	[ModuloGerRecebimento] [varchar](3) NULL,
	[ModuloGerBalFluxo] [varchar](3) NULL,
	[ModuloGerProducao] [varchar](3) NULL,
	[ModuloGerPremix] [varchar](3) NULL,
	[ModuloGerPreDosagem] [varchar](3) NULL,
	[ModuloGerContaminacao] [varchar](3) NULL,
	[ModuloGerPeletizacao] [varchar](3) NULL,
	[ModuloGerMoagem] [varchar](3) NULL,
	[ModuloGerExpedicao] [varchar](3) NULL,
	[ModuloGerEnsaque] [varchar](3) NULL,
	[ModuloGerEstoque] [varchar](3) NULL,
	[ModuloRastreabilidade] [varchar](3) NULL,
	[ModuloCEP] [varchar](3) NULL,
	[ModuloAnalise] [varchar](3) NULL,
	[ModuloManutencao] [varchar](3) NULL,
	[ModuloFormulacao] [varchar](3) NULL,
	[ModuloRelatoriosWeb] [varchar](3) NULL,
	[ModuloCadastrosWeb] [varchar](3) NULL,
	[ModuloQualidade] [varchar](3) NULL,
	[ModuloAPP] [varchar](3) NULL,
	[ModuloBussinessBI] [varchar](3) NULL,
	[QuantidadeLicencasSimultaneas] [int] NULL,
	[ScriptLicenca] [varchar](8000) NULL,
	[DataLimiteUso] [date] NULL,
	[DataStartup] [date] NULL,
	[ContraSenha] [varchar](8) NULL,
	[CodPais] [int] NULL,
	[ObservacaoGeral] [text] NULL,
	[ChaveFGNDigital] [nchar](10) NULL,
	[LicencasFGNDigital] [int] NULL,
	[ModuloRisco] [varchar](3) NULL,
	[IntegracaoWebServiceAvancado] [varchar](3) NULL,
	[ModuloGerExtrusao] [varchar](3) NULL,
	[ModuloManutencao2] [varchar](3) NULL,
 CONSTRAINT [PK_Cad_Cliente] PRIMARY KEY CLUSTERED 
(
	[CodCliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerCadastros]  DEFAULT ('NAO') FOR [ModuloGerCadastros]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerGeral]  DEFAULT ('NAO') FOR [ModuloGerGeral]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerParametros]  DEFAULT ('NAO') FOR [ModuloGerParametros]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerConfiguracao]  DEFAULT ('NAO') FOR [ModuloGerConfiguracao]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerRecebimento]  DEFAULT ('NAO') FOR [ModuloGerRecebimento]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerBalFluxo]  DEFAULT ('NAO') FOR [ModuloGerBalFluxo]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerProducao]  DEFAULT ('NAO') FOR [ModuloGerProducao]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerPremix]  DEFAULT ('NAO') FOR [ModuloGerPremix]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerPreDosagem]  DEFAULT ('NAO') FOR [ModuloGerPreDosagem]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerContaminacao]  DEFAULT ('NAO') FOR [ModuloGerContaminacao]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerPeletizacao]  DEFAULT ('NAO') FOR [ModuloGerPeletizacao]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerMoagem]  DEFAULT ('NAO') FOR [ModuloGerMoagem]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerExpedicao]  DEFAULT ('NAO') FOR [ModuloGerExpedicao]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerEnsaque]  DEFAULT ('NAO') FOR [ModuloGerEnsaque]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerEstoque]  DEFAULT ('NAO') FOR [ModuloGerEstoque]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloRastreabilidade]  DEFAULT ('NAO') FOR [ModuloRastreabilidade]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloCEP]  DEFAULT ('NAO') FOR [ModuloCEP]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloAnalise]  DEFAULT ('NAO') FOR [ModuloAnalise]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloManutencao]  DEFAULT ('NAO') FOR [ModuloManutencao]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloFormulacao]  DEFAULT ('NAO') FOR [ModuloFormulacao]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloRelatoriosWeb]  DEFAULT ('NAO') FOR [ModuloRelatoriosWeb]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloCadastrosWeb]  DEFAULT ('NAO') FOR [ModuloCadastrosWeb]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloQualidade]  DEFAULT ('NAO') FOR [ModuloQualidade]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloAPP]  DEFAULT ('NAO') FOR [ModuloAPP]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloBussinessBI]  DEFAULT ('NAO') FOR [ModuloBussinessBI]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloRisco]  DEFAULT ('NAO') FOR [ModuloRisco]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_IntegracaoWebServiceAvancado]  DEFAULT ('NAO') FOR [IntegracaoWebServiceAvancado]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloGerExtrusao]  DEFAULT ('NAO') FOR [ModuloGerExtrusao]
GO

ALTER TABLE [dbo].[Cad_Cliente] ADD  CONSTRAINT [DF_Cad_Cliente_ModuloManutencao2]  DEFAULT ('NAO') FOR [ModuloManutencao2]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [FK__Cad_Clien__CodMu__53F837BE] FOREIGN KEY([CodMunicipio])
REFERENCES [dbo].[Cad_Municipio] ([CodMunicipio])
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [FK__Cad_Clien__CodMu__53F837BE]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [FK__Cad_Clien__Usuar__56D4A469] FOREIGN KEY([Usuario])
REFERENCES [dbo].[Sys_UCTabUsers] ([UCIdUser])
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [FK__Cad_Clien__Usuar__56D4A469]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [FK_Cad_Cliente_CodClienteOrc] FOREIGN KEY([CodClienteOrc])
REFERENCES [dbo].[Cad_Cliente_Orc] ([CodCliente])
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [FK_Cad_Cliente_CodClienteOrc]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_IntegracaoBanco] CHECK  (([IntegracaoBanco]='SIM' OR [IntegracaoBanco]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_IntegracaoBanco]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_IntegracaoTXT] CHECK  (([IntegracaoTXT]='SIM' OR [IntegracaoTXT]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_IntegracaoTXT]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_IntegracaoWebService] CHECK  (([IntegracaoWebService]='SIM' OR [IntegracaoWebService]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_IntegracaoWebService]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_IntegracaoWebServiceAvancado] CHECK  (([IntegracaoWebServiceAvancado]='SIM' OR [IntegracaoWebServiceAvancado]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_IntegracaoWebServiceAvancado]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloAnalise] CHECK  (([ModuloAnalise]='SIM' OR [ModuloAnalise]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloAnalise]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloAPP] CHECK  (([ModuloAPP]='SIM' OR [ModuloAPP]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloAPP]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloBussinessBI] CHECK  (([ModuloBussinessBI]='SIM' OR [ModuloBussinessBI]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloBussinessBI]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloCadastrosWeb] CHECK  (([ModuloCadastrosWeb]='SIM' OR [ModuloCadastrosWeb]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloCadastrosWeb]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloCEP] CHECK  (([ModuloCEP]='SIM' OR [ModuloCEP]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloCEP]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloFormulacao] CHECK  (([ModuloFormulacao]='SIM' OR [ModuloFormulacao]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloFormulacao]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerBalFluxo] CHECK  (([ModuloGerBalFluxo]='SIM' OR [ModuloGerBalFluxo]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerBalFluxo]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerCadastros] CHECK  (([ModuloGerCadastros]='SIM' OR [ModuloGerCadastros]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerCadastros]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerConfiguracao] CHECK  (([ModuloGerConfiguracao]='SIM' OR [ModuloGerConfiguracao]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerConfiguracao]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerContaminacao] CHECK  (([ModuloGerContaminacao]='SIM' OR [ModuloGerContaminacao]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerContaminacao]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerEnsaque] CHECK  (([ModuloGerEnsaque]='SIM' OR [ModuloGerEnsaque]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerEnsaque]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerEstoque] CHECK  (([ModuloGerEstoque]='SIM' OR [ModuloGerEstoque]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerEstoque]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerExpedicao] CHECK  (([ModuloGerExpedicao]='SIM' OR [ModuloGerExpedicao]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerExpedicao]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerGeral] CHECK  (([ModuloGerGeral]='SIM' OR [ModuloGerGeral]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerGeral]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerParametros] CHECK  (([ModuloGerParametros]='SIM' OR [ModuloGerParametros]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerParametros]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerPeletizacao] CHECK  (([ModuloGerPeletizacao]='SIM' OR [ModuloGerPeletizacao]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerPeletizacao]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerPreDosagem] CHECK  (([ModuloGerPreDosagem]='SIM' OR [ModuloGerPreDosagem]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerPreDosagem]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerPremix] CHECK  (([ModuloGerPremix]='SIM' OR [ModuloGerPremix]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerPremix]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerProducao] CHECK  (([ModuloGerProducao]='SIM' OR [ModuloGerProducao]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerProducao]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloGerRecebimento] CHECK  (([ModuloGerRecebimento]='SIM' OR [ModuloGerRecebimento]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloGerRecebimento]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloManutencao] CHECK  (([ModuloManutencao]='SIM' OR [ModuloManutencao]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloManutencao]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloQualidade] CHECK  (([ModuloQualidade]='SIM' OR [ModuloQualidade]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloQualidade]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloRastreabilidade] CHECK  (([ModuloRastreabilidade]='SIM' OR [ModuloRastreabilidade]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloRastreabilidade]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloRelatoriosWeb] CHECK  (([ModuloRelatoriosWeb]='SIM' OR [ModuloRelatoriosWeb]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloRelatoriosWeb]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_Cliente_ModuloRisco] CHECK  (([ModuloRisco]='SIM' OR [ModuloRisco]='NAO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_Cliente_ModuloRisco]
GO

ALTER TABLE [dbo].[Cad_Cliente]  WITH CHECK ADD  CONSTRAINT [CK_Cad_ClienteStatus] CHECK  (([Status]='INATIVO' OR [Status]='ATIVO'))
GO

ALTER TABLE [dbo].[Cad_Cliente] CHECK CONSTRAINT [CK_Cad_ClienteStatus]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ATIVO-Ativo INATIVO-Inativo' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Cad_Cliente', @level2type=N'COLUMN',@level2name=N'Status'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM=Sim NAO=Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Cad_Cliente', @level2type=N'COLUMN',@level2name=N'IntegracaoTXT'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM=Sim NAO=Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Cad_Cliente', @level2type=N'COLUMN',@level2name=N'IntegracaoBanco'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM-Sim NAO-Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Cad_Cliente', @level2type=N'COLUMN',@level2name=N'ModuloGerMoagem'
GO

