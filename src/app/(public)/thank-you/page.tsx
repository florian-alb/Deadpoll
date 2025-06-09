import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="container max-w-2xl mx-auto py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Merci pour votre participation !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Vos réponses ont été enregistrées avec succès. Votre contribution
            est précieuse pour nous.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
