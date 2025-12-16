import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationsTab } from "@/components/integrations/IntegrationsTab";
import { SecurityTab } from "@/components/integrations/SecurityTab";

export default function Integrations() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold">Integrations & Security</h1>
        <p className="text-muted-foreground mt-1">
          Manage third-party connections and secure your workspace.
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="integrations" className="px-6">Integrations</TabsTrigger>
          <TabsTrigger value="security" className="px-6">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
