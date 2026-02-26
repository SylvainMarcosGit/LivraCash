import { PublicHeader } from "@/app/components/layout/PublicHeader";
import { PublicFooter } from "@/app/components/layout/PublicFooter";

export default function Terms() {

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader />
            <main className="flex-grow">
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales d'Utilisation</h1>
                        <p className="text-gray-500">Dernière mise à jour : 14 Février 2026</p>
                    </div>
                </section>
                <section className="py-12">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose max-w-none text-gray-700 space-y-6">
                            <p className="font-medium text-lg">Bienvenue sur LivraCash. En utilisant la plateforme LivraCash, vous acceptez les conditions suivantes...</p>

                            <h3 className="text-xl font-bold text-gray-900">1. Acceptation des conditions</h3>
                            <p>L'accès et l'utilisation de LivraCash sont soumis à l'acceptation et au respect des présentes Conditions Générales d'Utilisation.</p>

                            <h3 className="text-xl font-bold text-gray-900">2. Services proposés</h3>
                            <p>LivraCash est une place de marché permettant aux vendeurs de proposer leurs produits et aux acheteurs de les commander.</p>

                            <h3 className="text-xl font-bold text-gray-900">3. Responsabilités</h3>
                            <p>LivraCash agit en tant qu'intermédiaire et ne saurait être tenu responsable des produits vendus par les vendeurs tiers.</p>

                            <h3 className="text-xl font-bold text-gray-900">4. Modification des conditions</h3>
                            <p>Nous nous réservons le droit de modifier à tout moment les présentes conditions. Les changements seront effectifs dès leur publication.</p>
                        </div>
                    </div>
                </section>
            </main>
            <PublicFooter />
        </div>
    );
}
