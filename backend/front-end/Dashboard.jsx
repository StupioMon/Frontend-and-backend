import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";


// DonHeader Component
const DonHeader = ({ onLogout }) => {
  return (
    <header className="don-header">
      <div className="container">
      <nav className="nav-dash">
      <h1>Donation Dashboard</h1> 
      <button onClick={onLogout} className="logout-button">Logout</button>
     
      </nav>
      </div>
    </header>
  );
};

// DonFooter Component
const DonFooter = () => {
  return (
    <footer className="don-footer">
      <p>&copy; 2025 Donation Site | All Rights Reserved</p>
    </footer>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [recipients, setRecipients] = useState([]);

   
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    console.log("Dashboard Auth Check:", auth);  // Debugging

    if (!auth || !auth.isAuthenticated || auth.role !== "admin") {
        navigate("/signin");
    }
}, [navigate]);



      useEffect(() => {
        const fetchDonations = async () => {  // Mark the function as async
            try {
                const response = await fetch('http://localhost:5000/donations');
                const data = await response.json();
                setDonations(data);
            } catch (error) {
                console.error('Error fetching donations:', error);
            }
        };
    
        fetchDonations(); // Call the async function inside useEffect
    },[]);


    


    useEffect(() => {
 
    // Fetch donation data (Mock Data)
    const mockDonations = [
      { id: 1, name: "Munzurul islam", amount: 50, category: "Food", date: "2025-03-10", gender: "Male" },
      { id: 2, name: "Jane Smith", amount: 30, category: "Clothing", date: "2025-03-09", gender: "Female" },
      { id: 3, name: "Alice Brown", amount: 70, category: "Food", date: "2025-03-08", gender: "Female" },
      { id: 4, name: "Mon", amount: 100, category: "Food", date: "2025-03-07", gender: "Male" },
      { id: 5, name: "Emily Davis", amount: 40, category: "Clothing", date: "2025-03-06", gender: "Female" },
    ];
    setDonations(mockDonations);

    // Fetch recipient data (Mock Data)
    const mockRecipients = [
      { id: 1, name: "Rahim Uddin", location: "Dhaka", itemsReceived: "Clothes" },
      { id: 2, name: "Amina Begum", location: "Chittagong", itemsReceived: "Food" },
      { id: 3, name: "Faruk Ahmed", location: "Khulna", itemsReceived: "Clothes & Food" },
    ];
    setRecipients(mockRecipients);
  }, []);

   // Logout Function
   const handleLogout = () => {
    localStorage.removeItem("auth"); // Remove authentication data
    navigate("/signin"); // Redirect to Home Page
  };

  // Aggregate data
  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const foodDonations = donations.filter(d => d.category === "Food").length;
  const clothingDonations = donations.filter(d => d.category === "Clothing").length;

  // Aggregate donation data by gender
  const maleDonations = donations.filter(d => d.gender === "Male").reduce((sum, d) => sum + d.amount, 0);
  const femaleDonations = donations.filter(d => d.gender === "Female").reduce((sum, d) => sum + d.amount, 0);

  // Prepare data for charts
  const donationTrends = donations.map(donation => ({
    date: donation.date,
    amount: donation.amount,
  }));

  const genderData = [
    { name: "Male", amount: maleDonations },
    { name: "Female", amount: femaleDonations },
  ];

  const categoryData = [
    { name: "Food", value: foodDonations },
    { name: "Clothing", value: clothingDonations },
  ];

  // Prepare recipient data for PieChart (by items received)
  const recipientData = [
    { name: "Food", value: recipients.filter(r => r.itemsReceived.includes("Food")).length },
    { name: "Clothing", value: recipients.filter(r => r.itemsReceived.includes("Clothes")).length },
    { name: "Both", value: recipients.filter(r => r.itemsReceived === "Clothes & Food").length },
  ];

  const COLORS = ["#205781", "#4F959D", "#ADB2D4"];

  return (
    <div className="dashboard-container">
       <DonHeader onLogout={handleLogout} />

      <div className="stats">
        <div className="stat-card">Total Donations: ${totalDonations}</div>
        <div className="stat-card">Food Donations: {foodDonations}</div>
        <div className="stat-card">Clothing Donations: {clothingDonations}</div>
      </div>

      <div className="charts">
        {/* Donation Trends - Bar Chart */}
        <div className="chart">
          <h2>Donation Trends</h2>
          <BarChart width={400} height={300} data={donationTrends}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Donation Trends - Line Chart */}
        <div className="chart">
          <h2>Donation Amount Over Time</h2>
          <LineChart width={500} height={300} data={donationTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#FF8042" />
          </LineChart>
        </div>

        {/* Category Breakdown */}
        <div className="chart">
          <h2>Category Breakdown</h2>
          <PieChart width={400} height={300}>
            <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Gender-Based Donations */}
        <div className="chart">
          <h2>Donations by Gender</h2>
          <BarChart width={400} height={300} data={genderData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#4F959D" />
          </BarChart>
        </div>

        {/* Recipient Breakdown */}
        <div className="chart">
          <h2>Recipient Breakdown</h2>
          <PieChart width={400} height={300}>
            <Pie data={recipientData} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" dataKey="value">
              {recipientData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="donations-table">
        <h2>Recent Donations</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.name}</td>
                <td>${donation.amount}</td>
                <td>{donation.category}</td>
                <td>{donation.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

       {/* Recipient List Table */}
       <div className="recipients-table">
        <h2>Recipient List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Items Received</th>
            </tr>
          </thead>
          <tbody>
            {recipients.map((recipient) => (
              <tr key={recipient.id}>
                <td>{recipient.name}</td>
                <td>{recipient.location}</td>
                <td>{recipient.itemsReceived}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DonFooter />
    </div>
  );
};

export default Dashboard;
