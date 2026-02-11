import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Termos = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Uso - MiniGestor</title>
        <meta name="description" content="Termos de Uso da plataforma MiniGestor - Gestão de Finanças Pessoais para Moçambique." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Link>
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-2">Termos de Uso</h1>
          <p className="text-muted-foreground mb-8">Última atualização: 11 de Fevereiro de 2026</p>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao aceder e utilizar a plataforma MiniGestor, você concorda com estes Termos de Uso. 
                Se não concordar com qualquer parte destes termos, não deverá utilizar os nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                O MiniGestor é uma plataforma de gestão de finanças pessoais desenvolvida para utilizadores em Moçambique. 
                Permite registar e acompanhar receitas, despesas, carteiras (incluindo M-Pesa, e-Mola e dinheiro físico), 
                metas financeiras e dívidas. Todos os dados financeiros são inseridos manualmente pelo utilizador — 
                a plataforma não acede automaticamente a contas bancárias ou serviços de dinheiro móvel.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Registo e Conta</h2>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Deve fornecer informações verdadeiras e actualizadas ao criar a sua conta.</li>
                <li>É responsável por manter a confidencialidade da sua palavra-passe.</li>
                <li>Deve ter pelo menos 18 anos de idade para utilizar o serviço.</li>
                <li>Cada pessoa deve ter apenas uma conta na plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Planos e Pagamentos</h2>
              <p className="text-muted-foreground leading-relaxed">
                O MiniGestor oferece um período de teste gratuito e planos pagos. Os pagamentos são processados 
                de forma segura através dos nossos parceiros de pagamento. Ao subscrever um plano pago, concorda 
                com os respectivos termos de cobrança. Reservamo-nos o direito de alterar os preços com aviso 
                prévio de 30 dias.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Uso Aceitável</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Ao utilizar o MiniGestor, compromete-se a:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Não utilizar a plataforma para fins ilegais ou não autorizados.</li>
                <li>Não tentar aceder a contas de outros utilizadores.</li>
                <li>Não interferir com o funcionamento normal da plataforma.</li>
                <li>Não transmitir vírus ou código malicioso.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Propriedade Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todo o conteúdo, design, código e funcionalidades do MiniGestor são propriedade exclusiva 
                da plataforma e estão protegidos por direitos de autor. Não é permitida a reprodução, 
                distribuição ou modificação sem autorização prévia por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                O MiniGestor é uma ferramenta de organização financeira pessoal e não constitui aconselhamento 
                financeiro, fiscal ou de investimento. As decisões financeiras tomadas com base nas informações 
                da plataforma são da inteira responsabilidade do utilizador. Não garantimos a exactidão dos 
                cálculos ou projecções apresentados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Suspensão e Encerramento</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de suspender ou encerrar a sua conta caso haja violação destes termos, 
                uso abusivo da plataforma ou actividades fraudulentas. O utilizador pode encerrar a sua conta 
                a qualquer momento contactando o nosso suporte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Alterações aos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos actualizar estes Termos de Uso periodicamente. Notificaremos os utilizadores sobre 
                alterações significativas através do e-mail registado na conta. O uso continuado da plataforma 
                após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">10. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para questões relacionadas com estes Termos de Uso, entre em contacto connosco através do e-mail:{" "}
                <a href="mailto:contacto.minigestor@gmail.com" className="text-primary hover:underline">
                  contacto.minigestor@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">11. Lei Aplicável</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estes Termos de Uso são regidos pela legislação da República de Moçambique. Qualquer litígio 
                será resolvido nos tribunais competentes de Moçambique.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Termos;
