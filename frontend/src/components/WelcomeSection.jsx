import React from "react";
import { useAuth } from "../context/AuthContext";

const WelcomeSection = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <section className="welcome-section">
      <div>
        <h1 className="welcome-title">
          {greeting}, {userName} 👋
        </h1>

        <p className="welcome-subtitle">
          Welcome back! Continue working on your documents and collaborate with
          your team.
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;