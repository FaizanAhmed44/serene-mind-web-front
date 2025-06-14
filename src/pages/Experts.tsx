import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from 'react-router-dom';
import { UserAvatar } from "@/components/UserAvatar";

const Experts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [experts, setExperts] = useState([
    {
      id: 1,
      name: 'Dr. Emily Carter',
      title: 'Cognitive Behavioral Therapist',
      description: 'Specializes in CBT for anxiety and depression.',
      image: '/placeholder.svg',
      tags: ['CBT', 'Anxiety', 'Depression'],
    },
    {
      id: 2,
      name: 'Dr. David Lee',
      title: 'Mindfulness Coach',
      description: 'Helps individuals improve focus and reduce stress through mindfulness practices.',
      image: '/placeholder.svg',
      tags: ['Mindfulness', 'Stress Reduction', 'Meditation'],
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      title: 'Positive Psychology Practitioner',
      description: 'Focuses on enhancing well-being and happiness through positive psychology techniques.',
      image: '/placeholder.svg',
      tags: ['Positive Psychology', 'Happiness', 'Well-being'],
    },
    {
      id: 4,
      name: 'Dr. Michael Brown',
      title: 'Addiction Recovery Specialist',
      description: 'Provides support and guidance for individuals recovering from addiction.',
      image: '/placeholder.svg',
      tags: ['Addiction', 'Recovery', 'Support'],
    },
    {
      id: 5,
      name: 'Dr. Jennifer Wilson',
      title: 'Relationship Counselor',
      description: 'Helps couples and individuals navigate relationship challenges.',
      image: '/placeholder.svg',
      tags: ['Relationships', 'Counseling', 'Communication'],
    },
    {
      id: 6,
      name: 'Dr. Robert Davis',
      title: 'Trauma Therapist',
      description: 'Specializes in helping individuals heal from traumatic experiences.',
      image: '/placeholder.svg',
      tags: ['Trauma', 'Healing', 'Therapy'],
    },
  ]);

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">Find Experts</h1>
          <UserAvatar />
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for experts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredExperts.map(expert => (
              <Link key={expert.id} to={`/experts/${expert.id}`} className="hover:opacity-75 transition-opacity">
                <Card className="bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={expert.image} alt={expert.name} />
                        <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{expert.name}</h3>
                        <p className="text-sm text-muted-foreground">{expert.title}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">{expert.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {expert.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Experts;
