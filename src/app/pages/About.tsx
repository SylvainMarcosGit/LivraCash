import { PublicHeader } from "@/app/components/layout/PublicHeader";
import { PublicFooter } from "@/app/components/layout/PublicFooter";
import { Store, Truck, ShieldCheck, Clock, Users, TrendingUp, MapPin, Star, Package, Headphones } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";

export default function About() {
    const features = [
        {
            icon: Store,
            title: "Marketplace Complète",
            description: "Des milliers de produits de vendeurs locaux vérifiés, tous au même endroit."
        },
        {
            icon: Truck,
            title: "Livraison Rapide",
            description: "Réseau de livreurs disponibles pour une livraison express dans toute la ville."
        },
        {
            icon: ShieldCheck,
            title: "Paiements Sécurisés",
            description: "Transactions protégées avec paiement à la livraison ou en ligne."
        },
        {
            icon: Users,
            title: "Vendeurs Vérifiés",
            description: "Processus KYC rigoureux pour garantir la fiabilité de nos partenaires."
        },
        {
            icon: TrendingUp,
            title: "Gestion Simplifiée",
            description: "Dashboard complet pour les vendeurs avec analytics et statistiques."
        },
        {
            icon: Package,
            title: "Bon de Commande Imprimable",
            description: "Imprimez votre bon de commande pour une vérification sécurisée à la livraison."
        }
    ];

    const stats = [
        { value: "500+", label: "Vendeurs Actifs" },
        { value: "10,000+", label: "Produits Disponibles" },
        { value: "50+", label: "Livreurs Partenaires" },
        { value: "98%", label: "Satisfaction Client" }
    ];

    const values = [
        {
            icon: ShieldCheck,
            title: "Confiance",
            description: "Nous vérifions chaque vendeur pour garantir la qualité et l'authenticité des produits."
        },
        {
            icon: Truck,
            title: "Rapidité",
            description: "Livraison express disponible avec suivi en temps réel de vos commandes."
        },
        {
            icon: Star,
            title: "Excellence",
            description: "Service client disponible et système de notation pour une amélioration continue."
        },
        {
            icon: Package,
            title: "Diversité",
            description: "Large gamme de produits locaux et internationaux pour tous vos besoins."
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            FinMarket
                        </h1>
                        <p className="text-2xl md:text-3xl font-light mb-4 text-blue-100">
                            Votre Marketplace de Confiance
                        </p>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-50">
                            Connectant vendeurs et acheteurs avec livraison rapide et sécurisée
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Store className="h-5 w-5" />
                                <span>Boutiques Vérifiées</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Truck className="h-5 w-5" />
                                <span>Livraison Express</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <ShieldCheck className="h-5 w-5" />
                                <span>100% Sécurisé</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Mission</h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        </div>
                        <div className="prose lg:prose-xl mx-auto text-gray-700 text-center">
                            <p className="text-xl leading-relaxed">
                                FinMarket révolutionne le commerce en ligne au Bénin en créant un écosystème
                                où <strong>vendeurs locaux</strong>, <strong>acheteurs</strong> et <strong>livreurs</strong>
                                collaborent pour une expérience d'achat exceptionnelle.
                            </p>
                            <p className="mt-6 text-lg">
                                Nous croyons au potentiel du commerce digital pour transformer l'économie locale.
                                Notre plateforme offre aux entrepreneurs une vitrine moderne pour développer leur
                                activité, tout en garantissant aux clients une expérience d'achat sécurisée et pratique.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Fonctionnalités</h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Une plateforme complète pensée pour simplifier le commerce en ligne
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-600">
                                        <CardContent className="pt-8 pb-6">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                                    <Icon className="h-8 w-8 text-blue-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <div key={index} className="text-center">
                                        <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center mb-4">
                                            <Icon className="h-10 w-10 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {value.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comment Ça Marche ?</h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            <div className="text-center">
                                <div className="inline-flex h-16 w-16 rounded-full bg-blue-600 text-white items-center justify-center text-2xl font-bold mb-4">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Parcourez</h3>
                                <p className="text-gray-600">
                                    Explorez des milliers de produits de vendeurs vérifiés dans notre marketplace
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex h-16 w-16 rounded-full bg-blue-600 text-white items-center justify-center text-2xl font-bold mb-4">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Commandez</h3>
                                <p className="text-gray-600">
                                    Ajoutez vos articles au panier et finalisez votre commande en toute sécurité
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex h-16 w-16 rounded-full bg-blue-600 text-white items-center justify-center text-2xl font-bold mb-4">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Imprimez</h3>
                                <p className="text-gray-600">
                                    Téléchargez et imprimez votre bon de commande depuis le site pour vérification
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex h-16 w-16 rounded-full bg-blue-600 text-white items-center justify-center text-2xl font-bold mb-4">
                                    4
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Recevez</h3>
                                <p className="text-gray-600">
                                    Le livreur vérifie votre bon avant livraison. La boutique lui transmet aussi une copie
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-6">Prêt à Commencer ?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Rejoignez des milliers d'utilisateurs qui font confiance à FinMarket pour leurs achats en ligne
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/marketplace"
                                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Explorer la Marketplace
                            </a>
                            <a
                                href="/register"
                                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                            >
                                Devenir Vendeur
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
