const CATEGORIES = [
    "All",
    "Introductory Problems",
    "Sorting and Searching",
    "Dynamic Programming",
    "Graph Algorithms",
    "Range Queries",
    "Tree Algorithms",
    "Mathematics",
    "String Algorithms",
];

export default function Sidebar({ selectedCategory, onSelectCategory }) {
    return (
        <aside className="sidebar">
            <div className="brand">
                <span className="brand-dot" />
                <span className="brand-name">CSES_Tutor</span>
            </div>

            <div className="nav-section-label">Explore</div>
            <button
                className={`nav-item ${selectedCategory === "All" ? "active" : ""}`}
                onClick={() => onSelectCategory("All")}
            >
                All Problems
            </button>

            <div className="nav-section-label">Categories</div>
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <button
                    key={cat}
                    className={`nav-item ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => onSelectCategory(cat)}
                >
                    {cat}
                </button>
            ))}
        </aside>
    );
}