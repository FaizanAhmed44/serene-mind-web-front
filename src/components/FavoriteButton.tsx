
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  modules: number;
  category: string;
  instructor: string | { name: string; title: string; bio: string; photo: string; };
  rating: number;
  students: number;
  progress: number;
  image: string;
}

interface FavoriteButtonProps {
  course: Course;
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  course, 
  variant = "ghost", 
  size = "icon" 
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { toast } = useToast();
  const isCourseFavorite = isFavorite(course.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCourseFavorite) {
      removeFromFavorites(course.id);
      toast({
        title: "Removed from Interest",
        description: `${course.title} has been removed from your interests.`,
      });
    } else {
      addToFavorites(course);
      toast({
        title: "Added to Interest",
        description: `${course.title} has been added to your interests.`,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      className={`transition-colors ${
        isCourseFavorite 
          ? "text-red-500 hover:text-red-600" 
          : "text-gray-400 hover:text-red-500"
      }`}
    >
      <Heart 
        className={`h-4 w-4 ${isCourseFavorite ? "fill-current" : ""}`} 
      />
    </Button>
  );
};
