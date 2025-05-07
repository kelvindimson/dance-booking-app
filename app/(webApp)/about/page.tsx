import { Card, CardContent } from "@/components/ui/card";
import {
  Music,
  Users,
  Calendar,
  Clock,
  MapPin,
  Heart
} from "lucide-react";

const features = [
  {
    icon: Music,
    title: "Dance Excellence",
    description: "Offering a wide variety of dance styles and classes for all skill levels."
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a vibrant community of dancers, instructors, and enthusiasts."
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Easy class booking and management system for your convenience."
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description: "Book classes anytime, anywhere through our online platform."
  },
  {
    icon: MapPin,
    title: "Multiple Locations",
    description: "Partner studios across the city for your convenience."
  },
  {
    icon: Heart,
    title: "Passionate Team",
    description: "Dedicated instructors committed to your dance journey."
  }
];

const AboutUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 mt-36">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Dance Flow</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transforming the way you experience dance education through innovative
          technology and passionate community building.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="mb-16">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground">
            To make dance education accessible, enjoyable, and seamless for everyone.
            We strive to connect passionate dancers with talented instructors through
            our innovative platform, fostering a community where creativity and
            learning flourish.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card">
            <CardContent className="p-6">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Values Section */}
      <div className="text-center mb-16">
        <h2 className="text-2xl font-semibold mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-muted-foreground">
              Continuously improving our platform to provide the best dance management experience.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-muted-foreground">
              Creating a supportive environment where dancers can grow and thrive together.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-muted-foreground">
              Maintaining high standards in every aspect of our service.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <Card className="bg-primary/5">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Have questions about Dance Flow? We&apos;d love to hear from you.
          </p>
          <p className="text-muted-foreground">
            Email: group2kelvin@danceflow.com<br />
            Phone: (555) 123-4567
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsPage;