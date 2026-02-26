import { Link } from "react-router";
import { Store } from "lucide-react";

export function PublicFooter() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Store className="h-6 w-6" />
                            <span className="text-xl font-bold">FinMarket</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            La plateforme de référence pour le commerce en ligne au Bénin.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Produit</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/marketplace" className="hover:text-white transition-colors">Place de marché</Link></li>
                            <li><Link to="/features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Tarifs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Entreprise</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Carrières</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Légal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Conditions d'utilisation</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
                    <p>© 2026 FinMarket. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
