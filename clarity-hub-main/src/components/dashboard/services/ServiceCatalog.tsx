import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StudioServices from "./StudioServices";
import WorkspacePlans from "./WorkspacePlans";
import Addons from "./Addons";
import { Globe } from "lucide-react";

export default function ServiceCatalog() {
    const [currency, setCurrency] = useState<"INR" | "USD">("INR");

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Services & Pricing</h1>

                <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg self-start">
                    <Button
                        variant={currency === "INR" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrency("INR")}
                        className="text-xs"
                    >
                        INR (₹)
                    </Button>
                    <Button
                        variant={currency === "USD" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrency("USD")}
                        className="text-xs"
                    >
                        USD ($)
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="studio" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
                    <TabsTrigger value="studio">Studio Services</TabsTrigger>
                    <TabsTrigger value="workspace">Workspace Plans</TabsTrigger>
                    <TabsTrigger value="addons">Add-ons</TabsTrigger>
                </TabsList>

                <TabsContent value="studio" className="space-y-4 outline-none">
                    <StudioServices currency={currency} />
                </TabsContent>

                <TabsContent value="workspace" className="space-y-4 outline-none">
                    <WorkspacePlans currency={currency} />
                </TabsContent>

                <TabsContent value="addons" className="space-y-4 outline-none">
                    <Addons currency={currency} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
