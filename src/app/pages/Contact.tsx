import { PublicHeader } from "@/app/components/layout/PublicHeader";
import { PublicFooter } from "@/app/components/layout/PublicFooter";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent } from "@/app/components/ui/card";
import { MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Votre message a été envoyé avec succès !");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader />
            <main className="flex-grow">
                <section className="py-20 bg-indigo-50">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contactez-nous</h1>
                        <p className="text-xl text-gray-600">Une question ? Notre équipe est là pour vous aider.</p>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Contact Info */}
                            <div className="space-y-8">
                                <Card>
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Adresse</h3>
                                            <p className="text-gray-600">Cotonou, Bénin</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <Mail className="h-6 w-6 text-blue-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Email</h3>
                                            <p className="text-gray-600">contact@LivraCash.com</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <Phone className="h-6 w-6 text-blue-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
                                            <p className="text-gray-600">+229 01 23 45 67</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Prénom</Label>
                                            <Input id="firstName" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Nom</Label>
                                            <Input id="lastName" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <textarea
                                            id="message"
                                            className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        ></textarea>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Envoyer le message
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <PublicFooter />
        </div>
    );
}
