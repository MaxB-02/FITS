import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export default function PortfolioCard({ project }) {
  return (
    <Link href={`/portfolio/${project.id}`} className="group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={project.cover || 'https://picsum.photos/seed/template/600'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-emerald-500 transition-colors">
            {project.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {project.shortDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {project.useCases && project.useCases.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.useCases.slice(0, 3).map((useCase, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {useCase}
                </Badge>
              ))}
              {project.useCases.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.useCases.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
} 