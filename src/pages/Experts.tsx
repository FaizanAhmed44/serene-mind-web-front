import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Calendar, CheckCircle, BadgeCheck, Award, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ExpertsAPI } from "@/api/experts";
import { ExpertProfile } from "@/data/types/expert";
import { CustomLoader } from "@/components/CustomLoader";


const Experts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  const {
    data: experts = [],
    isLoading,
    error,
  } = useQuery<ExpertProfile[]>({
    queryKey: ["experts"],
    queryFn: () => ExpertsAPI.getExperts(),
  });

  const filteredExperts = experts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specializations.some((spec: string) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSpecialization =
      selectedSpecialization === "All" ||
      expert.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Find Experts
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CustomLoader />
          <motion.p
            className="text-lg text-muted-foreground"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading experts...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background to-muted/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Find Experts
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-center min-h-96"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.p
            className="text-destructive"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Error loading experts. Please try again.
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold text-foreground"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Find Experts
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="p-6 space-y-12">
        {/* Header */}
        <motion.div
          className="text-center space-y-8 py-12 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-6">
            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/30 blur-3xl rounded-full scale-150 opacity-70" />
                <h1 className="relative text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent leading-tight">
                  Mental Wellness Experts
                </h1>
              </div>
            </motion.div>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Connect with verified therapists and coaches for personalized support.
              Find the perfect expert to guide your mental wellness journey.
            </motion.p>
            {/* Search Bar */}
            <motion.div
              className="max-w-full sm:max-w-lg mx-auto flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search experts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Experts Grid */}
        {filteredExperts.length === 0 && experts.length > 0 ? (
          <motion.div
            className="text-center py-12 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            No experts found matching your search.
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <AnimatePresence>
              {filteredExperts.map((expert, index) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                >
                  <ExpertCard expert={expert} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Experts;

const ExpertCard = ({ expert }: { expert: ExpertProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
    >
      <Card
        className="group cursor-pointer transition-all duration-300 border-none shadow-xl bg-gradient-to-br from-white via-background to-muted/60 hover:scale-[1.025] hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary/70"
        tabIndex={0}
        aria-label={`Expert card for ${expert.name}`}
      >
        <CardHeader className="pb-0 pt-6 px-6">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ExpertCardAvatar expert={expert} />
            <div className="flex-1">
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {expert.name}
                </h3>
                {expert.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 100 }}
                  >
                    <BadgeCheck className="h-5 w-5 text-primary ml-1" />
                  </motion.div>
                )}
              </motion.div>
              <motion.p
                className="text-muted-foreground text-sm font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {expert.title}
              </motion.p>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 px-6 pb-6">
          <motion.div
            className="flex items-center justify-between text-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="flex items-center gap-1.5">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.4 }}
              >
                <Star
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  aria-label="Rating"
                />
              </motion.div>
              <span className="font-semibold text-foreground">{expert.rating ?? "N/A"}</span>
              <span className="text-muted-foreground">
                ({expert.totalStudents ?? 0} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <Users className="h-4 w-4" />
              </motion.div>
              <span>{expert.totalStudents ?? 0}</span>
            </div>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground line-clamp-3 italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {expert.bio || "No bio provided."}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            {expert.specializations?.slice(0, 3).map((spec: string, index: number) => (
              <motion.span
                key={spec}
                className="bg-gradient-to-r from-primary/10 to-muted px-3 py-1 rounded-full text-[10px] text-primary font-semibold shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.05, type: "spring", stiffness: 100 }}
              >
                {spec}
              </motion.span>
            ))}
            {expert.specializations?.length > 3 && (
              <motion.span
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.95 }}
              >
                +{expert.specializations.length - 3} more
              </motion.span>
            )}
          </motion.div>

          <div className=" space-x-2 pt-2">
            <Link to={`/experts/${expert.id}`}>
              <button
                className="w-full py-2 px-4 bg-gradient-to-r from-primary to-primary/70 text-white font-semibold rounded-lg shadow-md hover:from-primary hover:to-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200"
                type="button"
              >
                View Profile
              </button>
            </Link>
              
           
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ExpertCardAvatar = ({ expert }: { expert: ExpertProfile }) => {
  return (
    <motion.div
      className="relative mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
    >
      <motion.div
        className="absolute -top-2 -right-2 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 100 }}
      >
        {expert.verified && (
          <motion.span
            className="bg-primary rounded-full p-1 shadow-lg"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <BadgeCheck className="h-4 w-4 text-white" />
          </motion.span>
        )}
      </motion.div>
      {expert.avatar ? (
        <motion.img
          src={expert.avatar}
          alt={expert.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-primary/20 shadow-lg group-hover:scale-110 transition-transform duration-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
        />
      ) : (
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center mx-auto text-lg font-bold text-primary group-hover:scale-110 transition-transform duration-300 select-none border-4 border-primary/10 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
        >
          {(() => {
            const words = expert.name.trim().split(" ");
            if (words.length === 1) {
              return words[0][0]?.toUpperCase() || "";
            } else {
              return (words[0][0] + words[1][0]).toUpperCase();
            }
          })()}
        </motion.div>
      )}
    </motion.div>
  );
};
  