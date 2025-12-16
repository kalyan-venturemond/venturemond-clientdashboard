import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Building, Smartphone, Globe, MapPin } from "lucide-react";

export default function Onboarding() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        companyName: "",
        companySize: "",
        phone: "",
        address: "",
        website: "",
        industry: "",
        timezone: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedUser = await userService.updateMe(formData);
            updateUser(updatedUser);

            toast({
                title: "Profile Updated",
                description: "Your account is ready to go!",
            });
            navigate("/dashboard");
        } catch (error) {
            console.error("Onboarding error", error);
            toast({
                title: "Error",
                description: "Failed to save profile. Please try again or skip.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
            <Card className="w-full max-w-lg md:max-w-2xl animate-scale-in border-primary/20 shadow-xl">
                <CardHeader className="text-center pb-8 border-b">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Welcome to VentureMond!
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Let's get your workspace set up. Tell us a bit about your company.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Acme Inc."
                                    className="pl-9"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select onValueChange={(val) => handleSelectChange('industry', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="health">Healthcare</SelectItem>
                                    <SelectItem value="ecommerce">E-Commerce</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companySize">Company Size</Label>
                            <Select onValueChange={(val) => handleSelectChange('companySize', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-10">1-10 Employees</SelectItem>
                                    <SelectItem value="11-50">11-50 Employees</SelectItem>
                                    <SelectItem value="51-200">51-200 Employees</SelectItem>
                                    <SelectItem value="200+">200+ Employees</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="website"
                                    name="website"
                                    placeholder="https://acme.com"
                                    className="pl-9"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+1 (555) 000-0000"
                                    className="pl-9"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="123 Tech Blvd, San Francisco"
                                    className="pl-9"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground hover:text-foreground">
                        Skip for now
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} className="px-8" size="lg">
                        {isLoading ? "Saving..." : "Save & Continue"}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
