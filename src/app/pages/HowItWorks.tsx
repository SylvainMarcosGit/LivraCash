import { PublicHeader } from "@/app/components/layout/PublicHeader";
import { PublicFooter } from "@/app/components/layout/PublicFooter";
import { Button } from "@/app/components/ui/button";
import { Link } from "react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {

    const steps = [
        {
            number: "01",
            title: "Inscription",
            description: "Créez votre compte vendeur gratuitement en quelques clics."
        },
        {
            number: "02",
            title: "Configuration",
            description: "Configurez votre boutique, ajoutez vos produits et définissez vos préférences de livraison."
        },
        {
            number: "03",
            title: "Vente",
            description: "Commencez à vendre vos produits à des milliers de clients potentiels."
        }
    ];

    const benefits = [
        "Commission attractive sur les ventes",
        "Tableau de bord intuitif et complet",
        "Application mobile pour gérer votre boutique partout",
        "Support client dédié 7j/7",
        "Vérification KYC simplifiée et rapide",
        "Visibilité nationale et internationale"
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="py-20 bg-indigo-50">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Comment ça marche ?
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Découvrez comment LivraCash facilite la vente et l'achat en ligne.
                        </p>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 h-full">
                                        <div className="text-6xl font-bold text-blue-100 mb-4">
                                            {step.number}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 text-lg">
                                            {step.description}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                            <ArrowRight className="h-8 w-8 text-blue-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Vos avantages
                                </h2>
                                <p className="text-xl text-gray-600">
                                    Pourquoi choisir LivraCash pour développer votre activité ?
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-sm">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3 p-2">
                                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                                        <span className="text-lg text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Prêt à vous lancer ?
                        </h2>
                        <Link to="/register">
                            <Button size="lg" className="text-lg px-8">
                                Créer un compte vendeur
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
