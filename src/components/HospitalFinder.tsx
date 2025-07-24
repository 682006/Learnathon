import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Navigation, Star, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  type: 'government' | 'private' | 'clinic';
  services: string[];
  availability: 'open' | 'closed' | 'emergency-only';
}

export const HospitalFinder = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState('10');
  const { toast } = useToast();

  // Mock hospital data - in production, this would come from a real API
  const mockHospitals: Hospital[] = [
    {
      id: '1',
      name: 'District Government Hospital',
      address: 'Main Road, District Center',
      phone: '+91-9876543210',
      distance: 2.5,
      rating: 4.2,
      type: 'government',
      services: ['Emergency', 'General Medicine', 'Surgery', 'Pediatrics'],
      availability: 'open'
    },
    {
      id: '2',
      name: 'Rural Health Clinic',
      address: 'Village Center, Near Post Office',
      phone: '+91-9876543211',
      distance: 1.2,
      rating: 3.8,
      type: 'clinic',
      services: ['General Medicine', 'Basic Emergency', 'Vaccination'],
      availability: 'open'
    },
    {
      id: '3',
      name: 'Community Health Center',
      address: 'Block Headquarters',
      phone: '+91-9876543212',
      distance: 5.8,
      rating: 4.0,
      type: 'government',
      services: ['Emergency', 'Maternity', 'General Medicine', 'Laboratory'],
      availability: 'open'
    },
    {
      id: '4',
      name: 'City Medical Center',
      address: 'Urban Area, Medical Complex',
      phone: '+91-9876543213',
      distance: 15.2,
      rating: 4.5,
      type: 'private',
      services: ['Emergency', 'ICU', 'Specialist Care', 'Surgery', 'Diagnostics'],
      availability: 'open'
    }
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          findHospitals();
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location access denied",
            description: "Showing nearby hospitals based on general area",
            variant: "destructive"
          });
          findHospitals(); // Show mock data anyway
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive"
      });
      findHospitals(); // Show mock data anyway
      setLoading(false);
    }
  };

  const findHospitals = () => {
    // In production, this would make an API call to find real hospitals
    const filteredHospitals = mockHospitals.filter(
      hospital => hospital.distance <= parseInt(searchRadius)
    );
    setHospitals(filteredHospitals);
  };

  const getDirections = (hospital: Hospital) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodeURIComponent(hospital.address)}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(hospital.address)}`;
      window.open(url, '_blank');
    }
  };

  const callHospital = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-green-100 text-green-800';
      case 'clinic': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'emergency-only': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-medical-green shadow-lg">
        <CardHeader className="bg-gradient-to-r from-medical-light to-accent/50">
          <CardTitle className="flex items-center gap-2 text-medical-blue">
            <MapPin className="w-6 h-6" />
            Nearby Healthcare Facilities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search Radius (km)</label>
              <Input
                type="number"
                value={searchRadius}
                onChange={(e) => setSearchRadius(e.target.value)}
                placeholder="10"
                min="1"
                max="50"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={findHospitals} variant="medical" disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Finding...' : 'Search'}
              </Button>
            </div>
          </div>

          {hospitals.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hospitals found in the selected radius. Try increasing the search range.</p>
            </div>
          )}

          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <h3 className="font-semibold text-lg">{hospital.name}</h3>
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(hospital.type)}>
                            {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)}
                          </Badge>
                          <Badge className={getAvailabilityColor(hospital.availability)}>
                            {hospital.availability.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{hospital.address}</span>
                          <span className="font-medium">• {hospital.distance} km away</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{hospital.rating}/5</span>
                          <span className="text-muted-foreground">rating</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Available Services:</h4>
                        <div className="flex flex-wrap gap-1">
                          {hospital.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                      <Button
                        onClick={() => callHospital(hospital.phone)}
                        variant="medical"
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      <Button
                        onClick={() => getDirections(hospital)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hospitals.length > 0 && (
            <div className="mt-6 p-4 bg-medical-light rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-medical-blue mt-0.5" />
                <div>
                  <h4 className="font-medium text-medical-blue">Emergency Information</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    For life-threatening emergencies, call your local emergency number immediately. 
                    The nearest hospital with emergency services is {hospitals[0]?.name} at {hospitals[0]?.distance} km away.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};