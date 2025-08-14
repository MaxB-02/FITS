import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function PortfolioDetail({ project }) {
  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested project could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{project.title}</CardTitle>
              <CardDescription className="text-lg mb-4">{project.shortDesc}</CardDescription>
              {project.useCases && project.useCases.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.useCases.map((useCase, index) => (
                    <Badge key={index} variant="secondary">
                      {useCase}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {project.cover && (
              <img 
                src={project.cover} 
                alt={project.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Description */}
      {project.longDesc && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{project.longDesc}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            {/* Buy Template Button */}
            {project.buyUrl ? (
              <Button asChild variant="default" size="lg">
                <a href={project.buyUrl} target="_blank" rel="noopener noreferrer">
                  Buy Template
                </a>
              </Button>
            ) : (
              <Button asChild variant="default" size="lg">
                <a href={`/inquire?project=${project.id}`}>
                  Start a Project
                </a>
              </Button>
            )}

            {/* Preview Template Button */}
            {project.previewUrl && (
              <Button variant="outline" size="lg" asChild>
                <a href={project.previewUrl} target="_blank" rel="noopener noreferrer">
                  Preview Template
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {project.sheetUrl && (
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <a href={project.sheetUrl} target="_blank" rel="noopener noreferrer">
              View Google Sheet
            </a>
          </Button>
        </div>
      )}
    </div>
  );
} 