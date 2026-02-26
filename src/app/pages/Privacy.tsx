import { PublicHeader } from "@/app/components/layout/PublicHeader";
import { PublicFooter } from "@/app/components/layout/PublicFooter";

export default function Privacy() {

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader />
            <main className="flex-grow">
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
                        <p className="text-gray-500">Dernière mise à jour : 14 Février 2026</p>
                    </div>
                </section>
                <section className="py-12">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose max-w-none text-gray-700 space-y-6">
                            <p className="font-medium text-lg">Chez FinMarket, nous accordons une grande importance à la confidentialité de vos données...</p>

                            <h3 className="text-xl font-bold text-gray-900">1. Collecte des données</h3>
                            <p>Nous collectons les informations que vous nous fournissez lors de votre inscription et de l'utilisation de nos services.</p>

                            <h3 className="text-xl font-bold text-gray-900">2. Utilisation des données</h3>
                            <p>Vos données sont utilisées pour gérer vos commandes, améliorer nos services et vous communiquer des informations pertinentes.</p>

                            <h3 className="text-xl font-bold text-gray-900">3. Protection des données</h3>
                            <p>Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre tout accès non autorisé.</p>
                        </div>
                    </div>
                </section>
            </main>
            <PublicFooter />
        </div>
    );
}
