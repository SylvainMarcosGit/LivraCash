import { Link } from "react-router";
import { Button } from "@/app/components/ui/button";
import { PublicHeader } from "@/app/components/layout/PublicHeader";
import { PublicFooter } from "@/app/components/layout/PublicFooter";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  LayoutDashboard,
  Package,
  Shield,
  BarChart3,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Tableau de Bord Vendeur",
      description: "Suivez vos performances, ventes et produits avec un tableau de bord interactif."
    },
    {
      icon: Package,
      title: "Gestion de Commandes",
      description: "Gérez vos commandes de la réception à la livraison avec des mises à jour en temps réel."
    },
    {
      icon: Shield,
      title: "Sécurité & Conformité",
      description: "Processus KYC intégré pour garantir des vendeurs vérifiés et des transactions sécurisées."
    },
    {
      icon: BarChart3,
      title: "Analyse en temps réel",
      description: "Suivez les ventes, le revenu et les insights clients en temps réel"
    },
    {
      icon: Globe,
      title: "Support multilingue",
      description: "Servez les clients en anglais et français"
    },
    {
      icon: Zap,
      title: "Rapide & Fiable",
      description: "Plateforme ultra-rapide avec une garantie de disponibilité de 99,9%"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Inscription & Vérification",
      description: "Créez votre compte et complétez le processus KYC pour devenir un vendeur vérifié"
    },
    {
      number: "02",
      title: "Remplissez votre Boutique",
      description: "Ajoutez des produits, gérez les stocks et fixez vos prix facilement"
    },
    {
      number: "03",
      title: "Vendez & Encaissez",
      description: "Recevez des commandes, gérez les expéditions et suivez vos gains"
    }
  ];

  const benefits = [
    "Taux de commission transparents",
    "Tableau de bord analytique en temps réel",
    "Conception axée sur les mobiles - gérez votre boutique à la volée",
    "Support client 24/7 en plusieurs langues",
    "Vérification KYC rapide",
    "Acceptez les paiements internationaux"
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Votre Business en Ligne, Simplifié
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Créez votre boutique, gérez vos commandes et suivez vos revenus en temps réel. Une plateforme intuitive pour vendeurs ambitieux et acheteurs exigeants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Commencez à vendre aujourd'hui
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Parcourir le marché
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 mt-1">Vendeurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600 mt-1">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 mt-1">Taux de satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600 mt-1">Support client</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fonctionnalités puissantes conçues pour les commerçants africains
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Commencez en trois étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="text-6xl font-bold text-blue-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir FinMarket
              </h2>
              <p className="text-xl text-gray-600">
                Rejoignez des milliers de commerçants réussis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à commencer à vendre ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez notre marché aujourd'hui et faites grandir votre entreprise
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Créez votre compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
