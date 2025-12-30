import { Helmet } from "react-helmet-async";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import HowItWorks from "@/components/landing/HowItWorks";
import Differentials from "@/components/landing/Differentials";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>MiniGestor - Gestão de Finanças Pessoais para Moçambique</title>
        <meta
          name="description"
          content="Controle seu dinheiro com o MiniGestor. Organize M-Pesa, e-Mola e dinheiro físico num só lugar. Simples, seguro e feito para Moçambique."
        />
        <meta
          name="keywords"
          content="finanças pessoais, gestão financeira, M-Pesa, e-Mola, Moçambique, controle financeiro, orçamento"
        />
        <link rel="canonical" href="https://minigestor.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Problem />
          <Solution />
          <HowItWorks />
          <Differentials />
          <Testimonials />
          <Pricing />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
