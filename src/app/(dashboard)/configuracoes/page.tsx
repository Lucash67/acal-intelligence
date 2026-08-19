import { PageHeader } from "@/components/layout/page-header";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { providerLabel } from "@/lib/labels";
import { ORGANIZATION_PROFILE } from "@/mocks/organization";
import { getRuntimeConfig } from "@/services/dashboard-data";

export default function SettingsPage() {
  const config = getRuntimeConfig();

  return (
    <div>
      <PageHeader
        eyebrow="Configurações"
        title="Ambiente de desenvolvimento"
        description="Nenhuma credencial é exibida. Integrações reais ficam desligadas até a definição com Acal/TI."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardTitle>Cadastro institucional público</CardTitle>
          <dl className="grid gap-3 text-sm md:grid-cols-2">
            <Row label="Razão social" value={ORGANIZATION_PROFILE.legalName} />
            <Row label="Nome fantasia" value={ORGANIZATION_PROFILE.tradeName} />
            <Row label="CNPJ matriz" value={ORGANIZATION_PROFILE.taxId} />
            <Row label="Sede" value={ORGANIZATION_PROFILE.headquarters} />
            <Row label="Fundação" value={String(ORGANIZATION_PROFILE.foundedYear)} />
            <Row label="SAC" value={ORGANIZATION_PROFILE.phones.sac} />
            <Row label="Central de vendas" value={ORGANIZATION_PROFILE.phones.sales} />
            <Row label="Para empresas" value={ORGANIZATION_PROFILE.phones.companies} />
            <Row
              label="Produto"
              value={`${ORGANIZATION_PROFILE.productName} (${ORGANIZATION_PROFILE.productNameStatus === "WORKING_TITLE" ? "nome provisório" : ORGANIZATION_PROFILE.productNameStatus})`}
            />
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone="success">Público confirmado</Badge>
            <Badge tone="warning">Gerentes e códigos internos pendentes</Badge>
          </div>
        </Card>
        <Card>
          <CardTitle>Provedores ativos</CardTitle>
          <dl className="space-y-3 text-sm">
            <Row label="Fonte de dados" value={providerLabel(config.dataSourceProvider)} />
            <Row label="Inteligência" value={providerLabel(config.aiProvider)} />
            <Row label="Mensagens" value={providerLabel(config.messagingProvider)} />
            <Row label="Modo simulado" value={config.mockMode ? "Ativo" : "Desligado"} />
          </dl>
        </Card>
        <Card>
          <CardTitle>Conectividade</CardTitle>
          <div className="space-y-3">
            <Line
              label="Supabase / PostgreSQL"
              ok={config.databaseConfigured}
              detail={config.databaseConfigured ? "DATABASE_URL detectada" : "Ausente — persistência em memória"}
            />
            <Line
              label="OpenAI"
              ok={config.openaiConfigured}
              detail={config.openaiConfigured ? "OPENAI_API_KEY detectada" : "Ausente — provedor simulado"}
            />
            <Line label="Z-API" ok={false} detail="Desabilitado nesta fase" />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardTitle>Variáveis necessárias para persistência</CardTitle>
          <p className="mb-4 text-sm text-text-muted">
            Copie `.env.example` para `.env` e preencha apenas o que existir. Não invente credenciais.
          </p>
          <div className="space-y-2 font-mono text-xs text-text-muted">
            <p>DATABASE_URL</p>
            <p>DIRECT_URL</p>
            <p>OPENAI_API_KEY / OPENAI_MODEL</p>
            <p>ZAPI_INSTANCE_ID / ZAPI_TOKEN / ZAPI_CLIENT_TOKEN</p>
          </div>
          <div className="mt-5 flex gap-2">
            <Badge tone="warning">TODO(ACAL-INFRA)</Badge>
            <Badge>Supabase pessoal temporário</Badge>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardTitle>Tema</CardTitle>
          <p className="mb-4 text-sm text-text-muted">
            Claro para leitura neutra, escuro no navy marinho e ACAL com o azul bebê da marca.
          </p>
          <ThemeSwitcher />
        </Card>
        <Card className="lg:col-span-2">
          <CardTitle>Identidade visual</CardTitle>
          <p className="mb-4 text-sm text-text-muted">
            Primary amostrado do wordmark oficial da ACAL. O tema ACAL usa esse azul bebê como cor
            predominante; o navy fica reservado ao tema escuro.
          </p>
          <div className="mb-4 flex flex-wrap gap-3">
            <Swatch name="principal" value="#009CE0" className="bg-acal-primary" />
            <Swatch name="principal clara" value="#4DB8E8" className="bg-acal-primary-light" />
            <Swatch name="principal escura" value="#0077AB" className="bg-acal-primary-dark" />
            <Swatch name="fundo" value="tema ativo" className="bg-bg" />
            <Swatch name="superfície" value="tema ativo" className="bg-bg-card" />
          </div>
          <div className="flex gap-2">
            <Badge tone="warning">TODO(ACAL-BRAND)</Badge>
            <Badge>Brandbook 2024 pendente</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Swatch({ name, value, className }: { name: string; value: string; className: string }) {
  return (
    <div className="min-w-28">
      <div className={`mb-2 h-10 rounded-[var(--radius-sm)] border border-border ${className}`} />
      <p className="text-xs">{name}</p>
      <p className="font-mono text-[11px] text-text-muted">{value}</p>
    </div>
  );
}

function Line({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <div>
        <p>{label}</p>
        <p className="mt-1 text-text-muted">{detail}</p>
      </div>
      <Badge tone={ok ? "success" : "warning"}>{ok ? "Pronto" : "Desligado"}</Badge>
    </div>
  );
}
