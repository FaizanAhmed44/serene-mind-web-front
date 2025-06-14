import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/UserAvatar";

const expertsData = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    specialty: "Cognitive Behavioral Therapy",
    description: "Expert in CBT for anxiety and depression.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Dr. James Rodriguez",
    specialty: "Mindfulness and Stress Reduction",
    description: "Specializes in mindfulness techniques for stress management.",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Dr. Aisha Khan",
    specialty: "Trauma and PTSD",
    description: "Experienced in treating trauma and PTSD.",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Dr. Michael Lee",
    specialty: "Relationship Counseling",
    description: "Offers counseling for couples and families.",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Dr. Sarah Johnson",
    specialty: "Child and Adolescent Psychology",
    description: "Specializes in the mental health of children and teenagers.",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Dr. David Wilson",
    specialty: "Addiction Therapy",
    description: "Provides therapy for addiction and substance abuse.",
    image: "/placeholder.svg",
  },
];

const Experts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExperts, setFilteredExperts] = useState(expertsData);

  useEffect(() => {
    const results = expertsData.filter((expert) =>
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExperts(results);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">Find Experts</h1>
          <UserAvatar />
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for experts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-160px)] w-full rounded-md border">
          <div className="p-4 space-y-4">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="hover-lift transition-colors">
                <CardContent className="flex items-center space-x-4 p-4">
                  <Avatar>
                    <AvatarImage src={expert.image} alt={expert.name} />
                    <AvatarFallback>{expert.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <Link to={`/experts/${expert.id}`}>
                      <p className="text-sm font-medium leading-none hover:underline">{expert.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Experts;
