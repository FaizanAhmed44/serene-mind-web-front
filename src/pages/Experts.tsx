
import { useState } from "react";
import { Search, Star, Calendar, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const experts = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    specializations: ["Anxiety Disorders", "CBT", "Mindfulness"],
    rating: 4.9,
    reviews: 127,
    experience: "12+ years",
    verified: true,
    nextAvailable: "Tomorrow, 2:00 PM",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    bio: "Specializes in cognitive behavioral therapy for anxiety and depression. Expert in mindfulness-based interventions."
  },
  {
    id: 2,
    name: "Mark Thompson",
    title: "Speech & Confidence Coach",
    specializations: ["Public Speaking", "Social Anxiety", "Confidence Building"],
    rating: 4.8,
    reviews: 89,
    experience: "8+ years",
    verified: true,
    nextAvailable: "Today, 4:30 PM",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Former corporate trainer turned therapist, helping individuals overcome public speaking fears and build confidence."
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    title: "Behavioral Therapist",
    specializations: ["Decision Making", "Life Transitions", "Career Counseling"],
    rating: 4.9,
    reviews: 156,
    experience: "15+ years",
    verified: true,
    nextAvailable: "Friday, 10:00 AM",
    photo: "https://images.unsplash.com/photo-1594824248015-88379cfb1b0e?w=300&h=300&fit=crop&crop=face",
    bio: "Helps individuals navigate major life decisions and career transitions with evidence-based therapeutic approaches."
  },
  {
    id: 4,
    name: "Dr. Michael Rodriguez",
    title: "Clinical Psychiatrist",
    specializations: ["Depression", "Mood Disorders", "Medication Management"],
    rating: 4.9,
    reviews: 203,
    experience: "18+ years",
    verified: true,
    nextAvailable: "Monday, 9:00 AM",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    bio: "Board-certified psychiatrist specializing in treatment-resistant depression and comprehensive mental health care."
  }
];

const specializations = ["All", "Anxiety Disorders", "CBT", "Public Speaking", "Depression", "Life Transitions"];

const Experts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialization = selectedSpecialization === "All" || 
                                 expert.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search experts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-4 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mental Wellness Experts
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with verified therapists and coaches for personalized support
          </p>
        </div>

        {/* Specialization Filters */}
        <div className="flex flex-wrap gap-2 justify-center animate-slide-up">
          {specializations.map((specialization) => (
            <Button
              key={specialization}
              variant={selectedSpecialization === specialization ? "default" : "outline"}
              onClick={() => setSelectedSpecialization(specialization)}
              className="transition-all"
            >
              {specialization}
            </Button>
          ))}
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="hover-lift cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <img
                    src={expert.photo}
                    alt={expert.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto group-hover:scale-105 transition-transform duration-300"
                  />
                  {expert.verified && (
                    <CheckCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-primary bg-background rounded-full" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{expert.name}</h3>
                <p className="text-muted-foreground">{expert.title}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {expert.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{expert.rating}</span>
                    <span className="text-muted-foreground">({expert.reviews} reviews)</span>
                  </div>
                  <span className="text-muted-foreground">{expert.experience}</span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">{expert.bio}</p>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Next available: {expert.nextAvailable}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/experts/${expert.id}`}>View Profile</Link>
                  </Button>
                  <Button className="flex-1">Book Session</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experts;
