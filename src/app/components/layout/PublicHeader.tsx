import { Link, useLocation } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Store, Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicHeader() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Helper to determine if a link is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <Store className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">FinMarket</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/marketplace"
                            className={`${isActive("/marketplace") ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600 transition-colors"}`}
                        >
                            Place de marché
                        </Link>
                        <Link
                            to="/features"
                            className={`${isActive("/features") ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600 transition-colors"}`}
                        >
                            Fonctionnalités
                        </Link>
                        <Link
                            to="/how-it-works"
                            className={`${isActive("/how-it-works") ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600 transition-colors"}`}
                        >
                            Comment ça marche
                        </Link>
                    </div>


                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                {
                    isMenuOpen && (
                        <div className="md:hidden py-4 border-t mt-4 space-y-4">
                            <div className="flex flex-col gap-4">
                                <Link to="/marketplace" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                                    Place de marché
                                </Link>
                                <Link to="/features" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                                    Fonctionnalités
                                </Link>
                                <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                                    Comment ça marche
                                </Link>
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex gap-2">
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="ghost" size="sm">Connexion</Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                            <Button size="sm">Commencer</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </header >
    );
}
