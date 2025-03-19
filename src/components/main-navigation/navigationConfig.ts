
import { Users, BookOpen, Phone, MessageSquare, Bot } from "lucide-react";
import { ReactNode } from "react";

export interface NavigationButton {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  route: string | null;
}

// This function needs to be called within a component because
// it returns React components (icons)
export const getNavigationButtons = (): NavigationButton[] => [
  {
    id: "support-network",
    title: "Rede de Apoio",
    description: "Encontre apoio e recursos para ajudá-la",
    icon: <Users className="h-5 w-5" />,
    route: "/support-network"
  },
  {
    id: "diary",
    title: "Diário Seguro",
    description: "Registre seus pensamentos com privacidade",
    icon: <BookOpen className="h-5 w-5" />,
    route: "/diary"
  },
  {
    id: "safe-contact",
    title: "Contato Seguro",
    description: "Mantenha contatos importantes acessíveis",
    icon: <Phone className="h-5 w-5" />,
    route: "/safe-contact"
  },
  {
    id: "lady-ai",
    title: "LadyIA Assistente",
    description: "Sua assistente virtual para informações e ajuda",
    icon: <Bot className="h-5 w-5" />,
    route: "/lady-ai"
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Ajude-nos a melhorar nosso app",
    icon: <MessageSquare className="h-5 w-5" />,
    route: null
  }
];
