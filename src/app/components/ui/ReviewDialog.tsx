import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Star } from "lucide-react";
import { reviewService } from "@/app/services/reviewService";
import { toast } from "sonner";
import { useAuth } from "@/app/hooks/useAuth";

interface ReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    onReviewSubmitted: (newRating: number) => void;
}

export function ReviewDialog({ isOpen, onClose, productId, productName, onReviewSubmitted }: ReviewDialogProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [reviewerName, setReviewerName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (isOpen && user) {
            setReviewerName(`${user.first_name} ${user.last_name}`.trim());
        } else if (isOpen && !user) {
            setReviewerName("");
        }
    }, [isOpen, user]);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Veuillez sélectionner une note");
            return;
        }

        if (!isAnonymous && !reviewerName.trim()) {
            toast.error("Veuillez entrer votre nom");
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewService.addReview(productId, rating, comment, isAnonymous, isAnonymous ? undefined : reviewerName);
            toast.success("Avis envoyé avec succès");
            onReviewSubmitted(rating);
            onClose();
            // Reset form
            setRating(0);
            setComment("");
            setIsAnonymous(false);
            setReviewerName("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Échec de l'envoi de l'avis");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Noter ce produit</DialogTitle>
                    <DialogDescription>
                        Partagez votre expérience avec {productName}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                <Star
                                    className={`h-8 w-8 ${(hoverRating || rating) >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Commentaire (Optionnel)</Label>
                        <Textarea
                            id="comment"
                            placeholder="Écrivez votre avis ici..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="anonymous"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="anonymous" className="font-normal cursor-pointer">
                            Publier anonymement
                        </Label>
                    </div>

                    {!isAnonymous && (
                        <div className="space-y-2">
                            <Label htmlFor="reviewerName">Votre Nom *</Label>
                            <Input
                                id="reviewerName"
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                placeholder="John Doe"
                                required={!isAnonymous}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
                        {isSubmitting ? "Envoi en cours..." : "Envoyer l'avis"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
