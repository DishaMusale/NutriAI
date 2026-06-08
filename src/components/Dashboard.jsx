function Dashboard() {

  const profile = JSON.parse(
    localStorage.getItem("userprofile")
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome {profile?.name} 👋</h1>

      <h2>Your Profile</h2>

      <p><strong>Goal:</strong> {profile?.goal}</p>

      <p><strong>Diet:</strong> {profile?.dietType}</p>

      <p><strong>Budget:</strong> {profile?.budget}</p>

      <p><strong>Activity Level:</strong> {profile?.activityLevel}</p>

      <p><strong>Protein Priority:</strong> {profile?.proteinPriority}</p>

      <button>
        Generate Diet Plan
      </button>
    </div>
  );
}

export default Dashboard;