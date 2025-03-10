
import React from "react";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RecoveryMethod } from "./types";

interface RecoveryMethodInputProps {
  recoveryEmail: string;
  setRecoveryEmail: (email: string) => void;
  recoveryPhone: string;
  setRecoveryPhone: (phone: string) => void;
  recoveryMethod: RecoveryMethod;
  setRecoveryMethod: (method: RecoveryMethod) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const RecoveryMethodInput = ({
  recoveryEmail,
  setRecoveryEmail,
  recoveryPhone,
  setRecoveryPhone,
  recoveryMethod,
  setRecoveryMethod,
  isLoading,
  onSubmit,
}: RecoveryMethodInputProps) => {
  return (
    <Tabs defaultValue="email" onValueChange={(value) => setRecoveryMethod(value as RecoveryMethod)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Email
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" /> Telefone
        </TabsTrigger>
      </TabsList>
      
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <TabsContent value="email">
          <div>
            <Label htmlFor="recovery-email">Email</Label>
            <Input
              id="recovery-email"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="phone">
          <div>
            <Label htmlFor="recovery-phone">Telefone</Label>
            <Input
              id="recovery-phone"
              type="tel"
              value={recoveryPhone}
              onChange={(e) => setRecoveryPhone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
        </TabsContent>

        <Button
          type="submit"
          className="w-full bg-safelady hover:bg-safelady/90"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar código"}
        </Button>
      </form>
    </Tabs>
  );
};
