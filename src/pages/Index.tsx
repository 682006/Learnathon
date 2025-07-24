import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/ChatInterface";
import { DiagnosticReport } from "@/components/DiagnosticReport";
import { HospitalFinder } from "@/components/HospitalFinder";
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  Mic, 
  Globe, 
  Shield, 
  Clock,
  Users,
  Stethoscope,
  ArrowRight,
  CheckCircle,
  Star,
  Phone
} from 'lucide-react';
import heroImage from "@/assets/healthcare-hero.jpg";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'chat' | 'report' | 'hospitals'>('home');
  const [diagnosis, setDiagnosis] = useState<any>(null);

  const features = [
    {
      icon: MessageCircle,
      title: "AI Health Assistant",
      description: "Chat with our AI to assess your symptoms and get preliminary guidance",
      color: "text-medical-blue"
    },
    {
      icon: Mic,
      title: "Voice Support",
      description: "Speak in your local language - Hindi, Bengali, Telugu, and more",
      color: "text-medical-green"
    },
    {
      icon: MapPin,
      title: "Hospital Finder",
      description: "Locate nearby healthcare facilities and get directions",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your health information is private and secure",
      color: "text-muted-foreground"
    }
  ];

  const languages = [
    { name: "English", code: "EN" },
    { name: "हिंदी", code: "HI" },
    { name: "বাংলা", code: "BN" },
    { name: "తెలుగు", code: "TE" }
  ];

  const stats = [
    { icon: Users, value: "", label: "Rural Patients Helped" },
    { icon: Stethoscope, value: "", label: "Partner Hospitals" },
    { icon: Clock, value: "24/7", label: "Available Support" },
    { icon: Star, value: "", label: "User Rating" }
  ];

  const handleDiagnosisComplete = (diagnosisData: any) => {
    setDiagnosis(diagnosisData);
    setCurrentView('report');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface onDiagnosisComplete={handleDiagnosisComplete} />;
      case 'report':
        return diagnosis ? (
          <DiagnosticReport 
            diagnosis={diagnosis} 
            onFindHospitals={() => setCurrentView('hospitals')}
          />
        ) : null;
      case 'hospitals':
        return <HospitalFinder />;
      default:
        return null;
    }
  };

  if (currentView !== 'home') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => setCurrentView('home')} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Rural Health Link
            </Button>
            <div className="flex gap-2">
              <Button 
                onClick={() => setCurrentView('chat')} 
                variant={currentView === 'chat' ? 'medical' : 'ghost'}
                size="sm"
              >
                Chat
              </Button>
              {diagnosis && (
                <Button 
                  onClick={() => setCurrentView('report')} 
                  variant={currentView === 'report' ? 'medical' : 'ghost'}
                  size="sm"
                >
                  Report
                </Button>
              )}
              <Button 
                onClick={() => setCurrentView('hospitals')} 
                variant={currentView === 'hospitals' ? 'medical' : 'ghost'}
                size="sm"
              >
                Hospitals
              </Button>
            </div>
          </div>
          
          {renderCurrentView()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden surface-gradient">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 py-24 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="glass-effect text-primary border-primary/20 px-4 py-2 text-sm font-medium">
                  AI-Powered Healthcare Technology
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-heading font-bold text-gradient leading-[0.9] tracking-tight">
                  Rural Health Link
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
                  Professional healthcare guidance powered by AI - bridging the gap between rural communities and quality medical care through intelligent diagnostics and multilingual support.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setCurrentView('chat')} 
                  variant="hero" 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Health Check
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => setCurrentView('hospitals')} 
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Find Hospitals
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Available in:</span>
                {languages.map((lang) => (
                  <Badge key={lang.code} variant="outline" className="text-xs">
                    {lang.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 professional-gradient rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <img 
                src={heroImage} 
                alt="Rural healthcare technology" 
                className="relative rounded-2xl shadow-float w-full h-auto"
              />
              <div className="absolute inset-0 glass-gradient rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 card-gradient">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center elevated-card group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 professional-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-spring">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-gradient mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Healthcare Made <span className="text-medical-blue">Accessible</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform brings professional healthcare guidance to rural communities, 
              breaking down language and distance barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group floating-card">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 professional-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-spring shadow-glow">
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-medical-light/50 to-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple steps to better healthcare</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Describe Symptoms",
                description: "Tell our AI about your health concerns in your preferred language",
                icon: MessageCircle
              },
              {
                step: "2", 
                title: "Get Assessment",
                description: "Receive an AI-powered preliminary diagnosis and recommendations",
                icon: Stethoscope
              },
              {
                step: "3",
                title: "Find Care",
                description: "Get directed to nearby hospitals or healthcare providers",
                icon: MapPin
              }
            ].map((step, index) => (
              <Card key={index} className="relative overflow-hidden elevated-card group">
                <CardContent className="p-10 text-center">
                  <div className="w-16 h-16 professional-gradient text-white rounded-full flex items-center justify-center font-heading font-bold text-xl mx-auto mb-6 shadow-glow group-hover:scale-110 transition-spring">
                    {step.step}
                  </div>
                  <step.icon className="w-10 h-10 text-medical-green mx-auto mb-6" />
                  <h3 className="font-heading font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-medical-blue to-medical-green text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Your Health, Our Priority
            </h2>
            <p className="text-xl opacity-90">
              Access quality healthcare guidance anytime, anywhere. Start your health assessment now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setCurrentView('chat')} 
                variant="secondary" 
                size="lg"
                className="flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Start Free Assessment
              </Button>
              <Button 
                onClick={() => setCurrentView('hospitals')} 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Emergency? Find Hospitals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-medical-blue" />
                <span className="font-bold text-lg">Rural Health Link</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Democratizing healthcare access for rural communities through AI-powered technology.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Features</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-medical-green" />
                  <span>AI Symptom Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-medical-green" />
                  <span>Multilingual Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-medical-green" />
                  <span>Hospital Finder</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-medical-green" />
                  <span>Voice Recognition</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Emergency</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">For life-threatening emergencies:</p>
                <div className="flex items-center gap-2 text-emergency font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Call Local Emergency Services</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Rural Health Link. This is an AI assistant for preliminary guidance only. Always consult healthcare professionals for medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;