import { useState } from "react";
import { Link } from "react-router";
import { Check, X, HelpCircle, Star, Zap, Globe } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { PublicHeader } from "@/app/components/layout/PublicHeader";
import { PublicFooter } from "@/app/components/layout/PublicFooter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
            name: "Gratuit (Essai)",
            description: "Idéal pour tester la plateforme LivraCash",
            price: { monthly: 0, yearly: 0 },
            commission: "0%",
            features: [
                "20 produits maximum",
                "Durée limitée à 3 mois",
                "1 Livreur par zone",
                "Tableau de bord basique",
                "Paiement à la livraison",
            ],
            notIncluded: [
                "Support par email",
                "Badge Vendeur Vérifié",
                "Personnalisation boutique",
                "Campagnes publicitaires",
                "Intégration réseaux sociaux",
            ],
            cta: "Commencer l'essai",
            popular: false,
        },
        {
            name: "Standard",
            description: "Pour les vendeurs réguliers",
            price: { monthly: 15000, yearly: 150000 },
            commission: "3%",
            features: [
                "50 produits maximum",
                "Badge Vendeur Vérifié",
                "Personnalisation boutique (Logo, Nom)",
                "Support par email",
                "1 Livreur par zone",
                "Tableau de bord complet",
                "Notifications commandes (Email)",
            ],
            notIncluded: [
                "Produits illimités",
                "Campagnes publicitaires",
                "Visibilité maximale (Homepage)",
                "Intégration réseaux sociaux",
            ],
            cta: "Choisir Standard",
            popular: false,
        },
        {
            name: "Pro",
            description: "Pour les marques ambitieuses",
            price: { monthly: 45000, yearly: 450000 },
            commission: "2%",
            features: [
                "Produits illimités",
                "Badge Vendeur Vérifié",
                "Personnalisation boutique (Logo, Nom)",
                "Intégration réseaux sociaux",
                "1 Campagne pub / mois",
                "Visibilité maximale (Accueil, Newsletter)",
                "Notifications (Email & SMS)",
                "Support prioritaire",
            ],
            notIncluded: [],
            cta: "Devenir Pro",
            popular: true,
        },
    ];

    const featuresList = [
        {
            category: "Boutique & Identité",
            items: [
                { name: "Badge Vendeur Vérifié", starter: false, standard: true, pro: true },
                { name: "Personnalisation (Logo, Nom)", starter: false, standard: true, pro: true },
                { name: "Intégration Réseaux Sociaux", starter: false, standard: false, pro: true },
            ]
        },
        {
            category: "Marketing & Visibilité",
            items: [
                { name: "Campagne publicitaire", starter: false, standard: false, pro: "1 / mois" },
                { name: "Visibilité Homepage", starter: false, standard: false, pro: true },
                { name: "Newsletter", starter: false, standard: false, pro: true },
            ]
        },
        {
            category: "Ventes & Commissions",
            items: [
                { name: "Commission sur ventes", starter: "0%", standard: "3%", pro: "2%" },
                { name: "Produits", starter: "20", standard: "50", pro: "Illimité" },
                { name: "Durée", starter: "3 mois", standard: "Illimitée", pro: "Illimitée" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PublicHeader />

            <main className="flex-grow">
                {/* Header Section */}
                <section className="bg-white py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Investissez dans votre croissance
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                            Des plans flexibles avec abonnement et commissions réduites pour booster vos ventes.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className={`text-sm font-medium ${!isYearly ? "text-gray-900" : "text-gray-500"}`}>
                                Mensuel
                            </span>
                            <Switch
                                checked={isYearly}
                                onCheckedChange={setIsYearly}
                            />
                            <span className={`text-sm font-medium ${isYearly ? "text-gray-900" : "text-gray-500"}`}>
                                Annuel <span className="text-green-600 font-bold ml-1">-20%</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="container mx-auto px-4 py-12 -mt-10">
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <Card
                                key={index}
                                className={`flex flex-col relative h-full transition-all duration-200 hover:shadow-xl ${plan.popular ? "border-blue-500 shadow-md scale-105 z-10" : "border-gray-200"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-blue-600 hover:bg-blue-700 px-4 py-1 text-sm flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" /> Recommandé
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold flex justify-between items-center">
                                        {plan.name}
                                        {index > 0 && <Badge variant="secondary" className="text-xs">Vérifié</Badge>}
                                    </CardTitle>
                                    <CardDescription className="mt-2 min-h-[40px]">{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">
                                            {plan.price.monthly === 0
                                                ? "Gratuit"
                                                : `${(isYearly ? plan.price.yearly : plan.price.monthly).toLocaleString()} FCFA`}
                                        </span>
                                        {plan.price.monthly > 0 && (
                                            <span className="text-gray-500 ml-2 text-sm">
                                                /{isYearly ? "an" : "mois"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mb-6 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        Commission: {plan.commission}
                                    </div>

                                    <div className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3 text-gray-400">
                                                <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link
                                        to={`/register?plan=${plan.name.toLowerCase().split(' ')[0]}&billing=${isYearly ? 'yearly' : 'monthly'}`}
                                        className="w-full"
                                    >
                                        <Button
                                            className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                                            variant={plan.popular ? "default" : "outline"}
                                            size="lg"
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Features Comparison Table */}
                <section className="bg-white py-20 border-t border-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Comparaison des fonctionnalités
                        </h2>

                        <div className="overflow-x-auto max-w-5xl mx-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="py-4 px-6 text-xl font-semibold text-gray-900 bg-gray-50 rounded-tl-lg">Option</th>
                                        <th className="py-4 px-6 text-xl font-semibold text-gray-900 text-center bg-gray-50">Gratuit</th>
                                        <th className="py-4 px-6 text-xl font-semibold text-blue-600 text-center bg-blue-50">Standard</th>
                                        <th className="py-4 px-6 text-xl font-semibold text-gray-900 text-center bg-gray-50 rounded-tr-lg">Pro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {featuresList.map((section, sIndex) => (
                                        <>
                                            <tr key={`header-${sIndex}`}>
                                                <td colSpan={4} className="py-4 px-6 bg-gray-50 font-bold text-gray-700 uppercase text-xs tracking-wider">
                                                    {section.category}
                                                </td>
                                            </tr>
                                            {section.items.map((item, iIndex) => (
                                                <tr key={`row-${sIndex}-${iIndex}`} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-4 px-6 text-gray-700 font-medium">
                                                        <div className="flex items-center gap-2">
                                                            {item.name}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        {typeof item.starter === 'boolean' ? (
                                                            item.starter ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
                                                        ) : (
                                                            <span className="text-gray-700">{item.starter}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 text-center bg-blue-50/30">
                                                        {typeof item.standard === 'boolean' ? (
                                                            item.standard ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
                                                        ) : (
                                                            <span className="font-medium text-gray-900">{item.standard}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        {typeof item.pro === 'boolean' ? (
                                                            item.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
                                                        ) : (
                                                            <span className="text-gray-700">{item.pro}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-blue-600 py-20 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Besoin d'aide pour choisir ?</h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Nos experts sont là pour vous guider vers la solution la plus adaptée.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/contact">
                                <Button size="lg" variant="secondary" className="px-8">
                                    Contacter l'équipe
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
