import { PublicHeader } from "@/app/components/layout/PublicHeader";
import { PublicFooter } from "@/app/components/layout/PublicFooter";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Link } from "react-router";
import {
    LayoutDashboard,
    Package,
    Shield,
    BarChart3,
    Globe,
    Zap,
    ArrowRight
} from "lucide-react";

export default function Features() {

    const features = [
        {
            icon: LayoutDashboard,
            title: "Place de marché",
            description: "Une vitrine moderne pour exposer vos produits."
        },
        {
            icon: Package,
            title: "Paiements sécurisés",
            description: "Transactions sécurisées via plusieurs moyens de paiement."
        },
        {
            icon: Shield,
            title: "Sécurité avancée",
            description: "Protection des données et des transactions."
        },
        {
            icon: BarChart3,
            title: "Analyses détaillées",
            description: "Suivez vos performances de vente en temps réel."
        },
        {
            icon: Globe,
            title: "Multi-langue",
            description: "Accessible en plusieurs langues (Français par défaut)."
        },
        {
            icon: Zap,
            title: "Performance",
            description: "Une plateforme rapide et optimisée pour le mobile."
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="py-20 bg-blue-50">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Fonctionnalités
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Tout ce dont vous avez besoin pour gérer votre activité e-commerce.
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                                    <CardHeader>
                                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                            <feature.icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                                        <CardDescription className="text-base">
                                            {feature.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Développez votre business
                        </h2>
                        <Link to="/register">
                            <Button size="lg" className="text-lg px-8">
                                Commencer maintenant
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
