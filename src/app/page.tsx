import { auth } from "@/app/auth";
import LogoDeadpoll from "@/components/icons/logo-deadpoll";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogIn,
  BarChart2,
  Users,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 h-full">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <LogoDeadpoll className="size-14" />
            <h1 className="text-3xl font-bold">DeadPoll</h1>
          </div>
          {session?.user ? (
            <Link href="/dashboard">
              <Button size="lg">
                <ChevronRight className="w-5 h-5 mr-2" />
                Tableau de bord
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button size="lg">
                <LogIn className="w-5 h-5 mr-2" />
                Se connecter
              </Button>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">
              Créez et partagez vos sondages en quelques clics
            </h2>
            <p className="text-xl text-muted-foreground">
              Une plateforme simple et intuitive pour créer des sondages
              personnalisés et collecter des réponses en temps réel.
            </p>
            {!session?.user && (
              <Link href="./sign-in">
                <Button size="lg" className="mt-4">
                  Commencer maintenant
                  <LogIn className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
          <div className="relative">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <BarChart2 className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Sondages personnalisés</h3>
                      <p className="text-sm text-muted-foreground">
                        Créez des sondages adaptés à vos besoins
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Partage facile</h3>
                      <p className="text-sm text-muted-foreground">
                        Partagez vos sondages avec un simple lien
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Réponses en temps réel</h3>
                      <p className="text-sm text-muted-foreground">
                        Visualisez les résultats instantanément
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>©{new Date().getFullYear()} DeadPoll. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
