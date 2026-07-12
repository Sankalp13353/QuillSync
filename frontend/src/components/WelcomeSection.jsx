import React from "react";

const WelcomeSection = ({ user }) => {
  const userName = user?.name || "User";

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