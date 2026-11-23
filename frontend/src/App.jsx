import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ProblemExplorer from "./components/ProblemExplorer";
import ProblemWorkspace from "./components/ProblemWorkspace";

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (selectedCategory !== "All") params.append("category", selectedCategory);

    fetch(`${API_BASE}/api/problems?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProblems(data));
  }, [search, selectedCategory]);

  if (activeProblem) {
    return (
      <ProblemWorkspace
        problem={activeProblem}
        apiBase={API_BASE}
        onBack={() => setActiveProblem(null)}
      />
    );
  }

  return (
    <div className="home-layout">
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ProblemExplorer
        search={search}
        setSearch={setSearch}
        problems={problems}
        selectedCategory={selectedCategory}
        onOpenProblem={setActiveProblem}
      />
    </div>
  );
}