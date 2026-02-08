USE [SigaSoel]
GO

/****** Object:  Table [dbo].[Opr_Atendimento]    Script Date: 02/02/2026 14:54:12 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Opr_Atendimento](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CodCliente] [int] NOT NULL,
	[CodAtendimento] [int] NOT NULL,
	[ProtocoloAtendimento] [varchar](100) NOT NULL,
	[CodTipoAtendimento] [int] NULL,
	[CodDepartamento] [int] NULL,
	[CodResponsavel] [int] NULL,
	[CodPrioridade] [int] NOT NULL,
	[CodSistema] [int] NOT NULL,
	[CodOperadorAtendimento] [int] NOT NULL,
	[CodStatus] [int] NOT NULL,
	[Solicitante] [varchar](100) NULL,
	[TipoRegistrado] [varchar](30) NULL,
	[DataHoraInicial] [datetime] NOT NULL,
	[DataHoraFinal] [datetime] NULL,
	[TempoAtendimento] [varchar](8) NULL,
	[ProblemaRelatado] [text] NOT NULL,
	[SolucaoRepassada] [text] NOT NULL,
	[ImagemDocumento1] [image] NULL,
	[ImagemDocumento2] [image] NULL,
	[ImagemDocumento3] [image] NULL,
	[Usuario] [int] NULL,
	[DtModificacao] [datetime] NULL,
	[Tempo1] [time](7) NULL,
	[ValorPago] [varchar](10) NULL,
	[VerificadoAtendimento] [varchar](10) NULL,
	[VerificadoFinanceiro] [varchar](10) NULL,
	[CobrarAtendimento] [varchar](10) NULL,
	[CobradoOrcamento] [varchar](10) NULL,
	[NumeroNF] [varchar](30) NULL,
	[NumeroCotacao] [varchar](30) NULL,
	[CodAtendimentoPai] [int] NULL,
	[LiberadoCobranca] [char](3) NULL,
	[GerarCobranca] [char](3) NULL,
	[CodClienteFinanComp] [int] NULL,
 CONSTRAINT [PK_Opr_Atendimento] PRIMARY KEY CLUSTERED 
(
	[CodCliente] ASC,
	[CodAtendimento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Opr_Atendimento] ADD  CONSTRAINT [DF_Opr_Atendimento_ValorPago]  DEFAULT ('NAO') FOR [ValorPago]
GO

ALTER TABLE [dbo].[Opr_Atendimento] ADD  CONSTRAINT [DF_Opr_Atendimento_CobrarAtendimento]  DEFAULT ('NAO') FOR [CobrarAtendimento]
GO

ALTER TABLE [dbo].[Opr_Atendimento] ADD  CONSTRAINT [DF_Opr_Atendimento_CobradoOrcamento]  DEFAULT ('NAO') FOR [CobradoOrcamento]
GO

ALTER TABLE [dbo].[Opr_Atendimento] ADD  DEFAULT ('NAO') FOR [LiberadoCobranca]
GO

ALTER TABLE [dbo].[Opr_Atendimento] ADD  DEFAULT ('NAO') FOR [GerarCobranca]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [Opr_Atendimento_CodCliente] FOREIGN KEY([CodCliente])
REFERENCES [dbo].[Cad_Cliente_Orc] ([CodCliente])
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [Opr_Atendimento_CodCliente]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [Opr_Atendimento_CodClienteFinanComp] FOREIGN KEY([CodClienteFinanComp])
REFERENCES [dbo].[Cad_Cliente_Finan_Comp] ([CodClienteFinanComp])
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [Opr_Atendimento_CodClienteFinanComp]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [Opr_Atendimento_CodOperadorAtendimento] FOREIGN KEY([CodOperadorAtendimento])
REFERENCES [dbo].[Sys_UCTabUsers] ([UCIdUser])
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [Opr_Atendimento_CodOperadorAtendimento]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [Opr_Atendimento_CodPrioridade] FOREIGN KEY([CodPrioridade])
REFERENCES [dbo].[Cad_Atend_Prioridade] ([CodPrioridade])
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [Opr_Atendimento_CodPrioridade]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [Opr_Atendimento_CodSistema] FOREIGN KEY([CodSistema])
REFERENCES [dbo].[Cad_Atend_Sistema] ([CodSistema])
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [Opr_Atendimento_CodSistema]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [Opr_Atendimento_CodStatus] FOREIGN KEY([CodStatus])
REFERENCES [dbo].[Cad_Atend_Status] ([CodStatus])
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [Opr_Atendimento_CodStatus]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [Opr_Atendimento_CodTipoAtendimento] FOREIGN KEY([CodTipoAtendimento])
REFERENCES [dbo].[Cad_Atend_Tipo_Atendimento] ([CodTipoAtendimento])
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [Opr_Atendimento_CodTipoAtendimento]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [Opr_Atendimento_Usuario] FOREIGN KEY([Usuario])
REFERENCES [dbo].[Sys_UCTabUsers] ([UCIdUser])
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [Opr_Atendimento_Usuario]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [CK_Opr_Atendimento_01] CHECK  (([ValorPago]='SIM' OR [ValorPago]='NAO'))
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [CK_Opr_Atendimento_01]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [CK_Opr_Atendimento_02] CHECK  (([VerificadoAtendimento]='SIM' OR [VerificadoAtendimento]='NAO'))
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [CK_Opr_Atendimento_02]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [CK_Opr_Atendimento_03] CHECK  (([VerificadoFinanceiro]='SIM' OR [VerificadoFinanceiro]='NAO'))
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [CK_Opr_Atendimento_03]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [CK_Opr_Atendimento_05] CHECK  (([CobrarAtendimento]='SIM' OR [CobrarAtendimento]='NAO'))
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [CK_Opr_Atendimento_05]
GO

ALTER TABLE [dbo].[Opr_Atendimento]  WITH CHECK ADD  CONSTRAINT [CK_Opr_Atendimento_LiberadoCobranca] CHECK  (([LiberadoCobranca]='SIM' OR [LiberadoCobranca]='NAO'))
GO

ALTER TABLE [dbo].[Opr_Atendimento] CHECK CONSTRAINT [CK_Opr_Atendimento_LiberadoCobranca]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM=Sim NAO=Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Opr_Atendimento', @level2type=N'COLUMN',@level2name=N'ValorPago'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM=Sim NAO=Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Opr_Atendimento', @level2type=N'COLUMN',@level2name=N'VerificadoAtendimento'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM=Sim NAO=Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Opr_Atendimento', @level2type=N'COLUMN',@level2name=N'VerificadoFinanceiro'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM=Sim NAO=Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Opr_Atendimento', @level2type=N'COLUMN',@level2name=N'CobrarAtendimento'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM=Sim NAO=Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Opr_Atendimento', @level2type=N'COLUMN',@level2name=N'CobradoOrcamento'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SIM-Sim NAO-Não' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Opr_Atendimento', @level2type=N'COLUMN',@level2name=N'LiberadoCobranca'
GO

