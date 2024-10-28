import React from "react";
import Card from "../../ui/card";
import LinkButton from "../../ui/link-button";

const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      <Card>
        <h2>Next Duty Return Due:</h2>
        <p>31st October 2024</p>
        <LinkButton
          label="Generate return"
          type="accent"
          url="../guest-return"
        />
      </Card>
      <Card>
        <h2>Previous Returns</h2>
        <p>No returns made.</p>
      </Card>
      <Card>
        <h2>Total Duty Paid This Year:</h2>
        <p>£0.00</p>
      </Card>
    </div>
  );
};

export default Dashboard;
