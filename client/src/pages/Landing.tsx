import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Palette, Box, ShoppingBag, Zap, Sparkles, Store } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            <span className="text-xl font-heading font-bold">Atelier Enligne</span>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Se connecter</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-heading font-bold leading-tight">
                Créez vos produits
                <span className="block text-primary">personnalisés en 3D</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Transformez vos idées en réalité avec notre atelier de création 3D en temps réel. 
                Personnalisez des t-shirts, mugs, accessoires et bien plus encore.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-base" asChild data-testid="button-start-creating">
                <a href="/api/login">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Commencer à créer
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild data-testid="button-explore-products">
                <a href="/api/login">Explorer les produits</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t">
              <div>
                <div className="text-3xl font-heading font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Designs créés</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Produits disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-primary">2K+</div>
                <div className="text-sm text-muted-foreground">Créateurs actifs</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
              <Box className="w-48 h-48 text-primary/40" strokeWidth={1} />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-card border rounded-2xl p-4 shadow-xl">
              <Zap className="w-8 h-8 text-primary" />
              <div className="text-sm font-medium mt-2">Rendu 3D</div>
              <div className="text-xs text-muted-foreground">Temps réel</div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border rounded-2xl p-4 shadow-xl">
              <Palette className="w-8 h-8 text-primary" />
              <div className="text-sm font-medium mt-2">Éditeur Pro</div>
              <div className="text-xs text-muted-foreground">Illimité</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">
            Tout ce dont vous avez besoin pour créer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète avec des outils professionnels pour donner vie à vos créations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Box className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Visualisation 3D</h3>
            <p className="text-muted-foreground">
              Visualisez votre design en temps réel sur des modèles 3D ultra-réalistes. Rotation 360°, zoom et aperçu détaillé.
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Éditeur Professionnel</h3>
            <p className="text-muted-foreground">
              Ajoutez du texte, des images, des formes. Système de calques complet avec contrôles avancés et undo/redo.
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Large Catalogue</h3>
            <p className="text-muted-foreground">
              Plus de 50 produits personnalisables : vêtements, accessoires, objets de décoration et bien plus.
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Sauvegarde Automatique</h3>
            <p className="text-muted-foreground">
              Ne perdez jamais votre travail. Vos designs sont automatiquement sauvegardés pendant que vous créez.
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Marketplace Intégrée</h3>
            <p className="text-muted-foreground">
              Vendez vos créations ! Créez votre boutique en ligne et commencez à générer des revenus.
            </p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Qualité Premium</h3>
            <p className="text-muted-foreground">
              Impression haute qualité sur des produits soigneusement sélectionnés. Satisfaction garantie.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-12 text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">
            Prêt à créer quelque chose d'unique ?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers de créateurs qui utilisent Atelier Enligne pour donner vie à leurs idées.
          </p>
          <Button size="lg" variant="secondary" className="text-base" asChild data-testid="button-get-started">
            <a href="/api/login">
              <Sparkles className="w-5 h-5 mr-2" />
              Commencer gratuitement
            </a>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold">Atelier Enligne</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Atelier Enligne. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
