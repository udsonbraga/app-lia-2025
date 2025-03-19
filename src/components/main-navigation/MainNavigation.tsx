
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationCard } from "./NavigationCard";
import { FeedbackDialog } from "./FeedbackDialog";
import { getNavigationButtons } from "./navigationConfig";

export function MainNavigation() {
  const navigate = useNavigate();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const navigationButtons = getNavigationButtons();

  return (
    <div className="flex flex-col space-y-3">
      {navigationButtons.map((button) => (
        <NavigationCard
          key={button.id}
          id={button.id}
          title={button.title}
          description={button.description}
          icon={button.icon}
          onClick={() => {
            if (button.id === "feedback") {
              setFeedbackOpen(true);
            } else if (button.route) {
              navigate(button.route);
            }
          }}
        />
      ))}

      {/* Feedback Dialog */}
      <FeedbackDialog 
        feedbackOpen={feedbackOpen}
        setFeedbackOpen={setFeedbackOpen}
      />
    </div>
  );
}
