export default function ProblemExplorer({ search, setSearch, problems, selectedCategory, onOpenProblem }) {
    return (
        <main className="explorer-main">
            <div className="explorer-header">
                <h1>{selectedCategory === "All" ? "CSES Problem Set" : selectedCategory}</h1>
                <p>Select a problem to explore its intuition and step-by-step visual execution.</p>
            </div>

            <input
                type="text"
                className="search-bar"
                placeholder="Search problems by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="problem-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Problem</th>
                        <th>Category</th>
                        <th>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((p) => (
                        <tr key={p.id} className="problem-row" onClick={() => onOpenProblem(p)}>
                            <td className="problem-id">{p.id}</td>
                            <td className="problem-title">{p.title}</td>
                            <td><span className="category-tag">{p.category}</span></td>
                            <td className={`diff-${p.difficulty.toLowerCase()}`}>{p.difficulty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}