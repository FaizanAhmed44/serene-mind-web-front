import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/UserAvatar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">Core Cognitive</h1>
          <UserAvatar />
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Welcome to Core Cognitive
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your mental wellness journey starts here. Explore our resources and connect with experts.
        </p>
        <div className="space-x-4">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Get Started
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Explore Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Personalized Assessments</h3>
              <p className="text-muted-foreground">
                Take our personalized assessments to understand your mental wellness needs.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Expert Guidance</h3>
              <p className="text-muted-foreground">
                Connect with certified mental health experts for personalized guidance and support.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Wellness Resources</h3>
              <p className="text-muted-foreground">
                Access a wide range of resources, including articles, videos, and guided meditations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-24 px-4 md:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-muted-foreground italic">
                "Core Cognitive has been a game-changer for my mental wellness journey. The personalized assessments and expert guidance have helped me understand and manage my mental health better."
              </p>
              <p className="font-semibold text-foreground">- John Doe</p>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground italic">
                "I love the wide range of wellness resources available on Core Cognitive. The guided meditations have been particularly helpful in reducing my stress and anxiety."
              </p>
              <p className="font-semibold text-foreground">- Jane Smith</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 md:px-6 bg-background border-t border-border text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Core Cognitive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
