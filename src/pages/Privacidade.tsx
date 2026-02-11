import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacidade = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade - MiniGestor</title>
        <meta name="description" content="Política de Privacidade da plataforma MiniGestor - como protegemos os seus dados." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Link>
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidade</h1>
          <p className="text-muted-foreground mb-8">Última atualização: 11 de Fevereiro de 2026</p>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Introdução</h2>
              <p className="text-muted-foreground leading-relaxed">
                O MiniGestor está comprometido com a protecção da sua privacidade. Esta Política de Privacidade 
                explica como recolhemos, utilizamos, armazenamos e protegemos as suas informações pessoais 
                quando utiliza a nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Dados que Recolhemos</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Recolhemos os seguintes tipos de informação:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li><strong>Dados de registo:</strong> nome, endereço de e-mail e número de telefone (opcional).</li>
                <li><strong>Dados financeiros:</strong> receitas, despesas, saldos de carteiras, metas e dívidas — todos inseridos manualmente por si.</li>
                <li><strong>Dados de utilização:</strong> informações sobre como interage com a plataforma (páginas visitadas, funcionalidades utilizadas).</li>
                <li><strong>Dados técnicos:</strong> tipo de dispositivo, navegador e endereço IP para fins de segurança.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Como Utilizamos os Dados</h2>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Fornecer e melhorar os serviços da plataforma.</li>
                <li>Gerar relatórios e análises financeiras personalizadas para si.</li>
                <li>Enviar notificações relevantes sobre a sua conta e alertas financeiros.</li>
                <li>Garantir a segurança da sua conta e prevenir fraudes.</li>
                <li>Cumprir obrigações legais aplicáveis.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Acesso Automático a Contas</h2>
              <p className="text-muted-foreground leading-relaxed">
                O MiniGestor <strong>não acede automaticamente</strong> a nenhuma conta bancária, M-Pesa, e-Mola 
                ou qualquer outro serviço financeiro. Todos os dados financeiros são inseridos manualmente pelo 
                utilizador. Não armazenamos senhas ou credenciais de serviços financeiros terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Protecção dos Dados</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Implementamos medidas de segurança rigorosas para proteger os seus dados:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Encriptação de dados em trânsito (HTTPS/TLS).</li>
                <li>Controlo de acesso rigoroso — apenas você pode ver os seus dados financeiros.</li>
                <li>Políticas de segurança ao nível da base de dados (Row Level Security) para isolar os dados de cada utilizador.</li>
                <li>Monitorização contínua de actividades suspeitas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Partilha de Dados</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                <strong>Não vendemos, alugamos ou partilhamos</strong> os seus dados pessoais com terceiros para fins 
                comerciais. Os seus dados podem ser partilhados apenas nas seguintes circunstâncias:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Com prestadores de serviços essenciais ao funcionamento da plataforma (alojamento, processamento de pagamentos).</li>
                <li>Quando exigido por lei ou ordem judicial.</li>
                <li>Para proteger os direitos e segurança do MiniGestor e dos seus utilizadores.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Os Seus Direitos</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Enquanto utilizador, tem direito a:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li><strong>Acesso:</strong> solicitar uma cópia dos seus dados pessoais.</li>
                <li><strong>Rectificação:</strong> corrigir dados incorrectos ou desactualizados.</li>
                <li><strong>Eliminação:</strong> solicitar a eliminação da sua conta e dados associados.</li>
                <li><strong>Portabilidade:</strong> solicitar os seus dados num formato estruturado.</li>
                <li><strong>Oposição:</strong> opor-se ao tratamento dos seus dados para determinados fins.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Para exercer qualquer destes direitos, contacte-nos através do e-mail indicado abaixo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos os seus dados enquanto a sua conta estiver activa. Após o encerramento da conta, 
                os dados serão eliminados no prazo de 30 dias, excepto quando a retenção for necessária 
                para cumprir obrigações legais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos cookies essenciais para o funcionamento da plataforma, nomeadamente para manter 
                a sua sessão activa e garantir a segurança. Não utilizamos cookies de rastreamento publicitário.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">10. Menores de Idade</h2>
              <p className="text-muted-foreground leading-relaxed">
                O MiniGestor não é destinado a menores de 18 anos. Não recolhemos intencionalmente dados 
                de menores. Se tomarmos conhecimento de que um menor nos forneceu dados pessoais, procederemos 
                à sua eliminação imediata.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">11. Alterações a esta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos actualizar esta Política de Privacidade periodicamente. Notificaremos os utilizadores 
                sobre alterações significativas através do e-mail registado na conta. A data da última 
                actualização será sempre indicada no topo deste documento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">12. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para questões relacionadas com a sua privacidade ou para exercer os seus direitos, 
                entre em contacto connosco:{" "}
                <a href="mailto:contacto.minigestor@gmail.com" className="text-primary hover:underline">
                  contacto.minigestor@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacidade;
