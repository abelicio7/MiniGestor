import { Link } from "react-router-dom";
import { Wallet, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">MiniGestor</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Gestão de finanças pessoais feita para Moçambique. 
              Simples, ético e focado no seu bem-estar financeiro.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/termos" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <a
              href="mailto:contacto.minigestor@gmail.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              contacto.minigestor@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} MiniGestor. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
