import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/UserAvatar";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">Core Cognitive</h1>
          <UserAvatar />
        </div>
      </div>

      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Welcome to Core Cognitive
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Your personalized platform for mental wellness and cognitive
                enhancement. Explore resources, connect with experts, and embark
                on a journey to a healthier mind.
              </p>
              <div className="space-x-4">
                <a
                  href="/experts"
                  className="inline-block bg-primary text-primary-foreground hover:bg-primary/80 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Find an Expert
                </a>
                <a
                  href="/dashboard"
                  className="inline-block bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
            <div>
              <img
                src="/placeholder.svg"
                alt="Core Cognitive Platform"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <h3 className="text-2xl font-semibold text-center text-foreground mb-8">
            Explore Our Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Personalized Learning Paths
              </h4>
              <p className="text-muted-foreground">
                Curated content tailored to your unique needs and goals.
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Expert Guidance
              </h4>
              <p className="text-muted-foreground">
                Connect with certified professionals for personalized support.
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Progress Tracking
              </h4>
              <p className="text-muted-foreground">
                Monitor your journey and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <h3 className="text-2xl font-semibold text-center text-foreground mb-8">
            Success Stories
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <p className="text-muted-foreground italic mb-4">
                "Core Cognitive has transformed my approach to mental wellness.
                The personalized resources and expert guidance have been
                invaluable."
              </p>
              <p className="font-semibold text-foreground">- Jane Doe</p>
            </div>
            <div className="p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <p className="text-muted-foreground italic mb-4">
                "I've gained practical tools and strategies to manage stress and
                improve my overall cognitive function. Thank you, Core
                Cognitive!"
              </p>
              <p className="font-semibold text-foreground">- John Smith</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-card text-card-foreground py-8 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Core Cognitive. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
