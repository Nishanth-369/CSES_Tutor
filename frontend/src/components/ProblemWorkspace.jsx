import { useState, useEffect } from "react";
import SequenceVisualizer from "./SequenceVisualizer";

export default function ProblemWorkspace({ problem, apiBase, onBack }) {
    const [openHints, setOpenHints] = useState({});
    const [customInput, setCustomInput] = useState(problem.sample_input || "");
    const [activeInput, setActiveInput] = useState(problem.sample_input || "");
    const [runTrigger, setRunTrigger] = useState(0);
    const [inputError, setInputError] = useState("");

    useEffect(() => {
        setOpenHints({});
        setCustomInput(problem.sample_input || "");
        setActiveInput(problem.sample_input || "");
        setInputError("");
        setRunTrigger(0);
    }, [problem.id, problem.sample_input]);

    const toggleHint = (index) => {
        setOpenHints((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    // Validate input according to the problem's test case rules
    const handleVisualize = () => {
        const trimmed = customInput.trim();

        if (!trimmed) {
            setInputError("Input cannot be empty. Please enter a valid test case.");
            return;
        }

        if (problem.id === "1068") {
            // Must be a single positive integer between 1 and 1,000,000
            if (!/^\d+$/.test(trimmed)) {
                setInputError("Invalid input: Weird Algorithm expects a single positive integer (e.g., 3 or 7).");
                return;
            }
            const n = Number(trimmed);
            if (n < 1 || n > 1000000) {
                setInputError("Out of range: Please enter an integer n between 1 and 1,000,000.");
                return;
            }
        }

        // Valid input -> clear error and trigger visualization on right panel
        setInputError("");
        setActiveInput(trimmed);
        setRunTrigger((t) => t + 1);
    };

    const { intuition } = problem;

    return (
        <div className="workspace-shell">
            <header className="workspace-topbar">
                <button className="back-btn" onClick={onBack}>
                    ← All Problems
                </button>
                <span className="topbar-title">
                    {problem.id} · {problem.title}
                </span>
                <span className="category-tag">{problem.category}</span>
            </header>

            <div className="split-container">
                {/* Left Panel (40%) */}
                <section className="left-panel">
                    <h1>{problem.title}</h1>
                    <div className="meta-row">
                        <span className="category-tag">{problem.category}</span>
                        <span className={`diff-${problem.difficulty.toLowerCase()}`}>
                            {problem.difficulty}
                        </span>
                    </div>

                    <div className="doc-section">
                        <h3>Simplified Problem</h3>
                        <p>{problem.simplified_statement}</p>
                    </div>

                    <div className="doc-section">
                        <h3>Input</h3>
                        <p>{problem.input_spec}</p>
                    </div>

                    <div className="doc-section">
                        <h3>Output</h3>
                        <p>{problem.output_spec}</p>
                    </div>

                    {/* Editable Sample Input + Visualize Button */}
                    <div className="doc-section">
                        <div className="input-label-row">
                            <h3>Sample Input (Editable)</h3>
                            <span className="input-hint-text">Backspace & type your own</span>
                        </div>
                        <textarea
                            className={`code-input ${inputError ? "has-error" : ""}`}
                            rows={2}
                            value={customInput}
                            onChange={(e) => {
                                setCustomInput(e.target.value);
                                if (inputError) setInputError("");
                            }}
                            spellCheck={false}
                        />
                        {inputError && <div className="input-error">{inputError}</div>}

                        <div className="visualize-action-row">
                            <button className="btn btn-accent" onClick={handleVisualize}>
                                ▶ Visualize
                            </button>
                        </div>
                    </div>

                    <div className="doc-section">
                        <h3>Sample Output</h3>
                        <div className="code-block">{problem.sample_output}</div>
                    </div>

                    {/* LeetCode-style Progressive Hints */}
                    {intuition && (
                        <div className="doc-section">
                            <h3>Hints</h3>
                            <div className="hints-list">
                                <div className="hint-item">
                                    <button className="hint-header" onClick={() => toggleHint(1)}>
                                        <span>Hint 1 — Key Idea</span>
                                        <span className="hint-chevron">{openHints[1] ? "▲" : "▼"}</span>
                                    </button>
                                    {openHints[1] && (
                                        <div className="hint-body">
                                            <p>{intuition.key_idea}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="hint-item">
                                    <button className="hint-header" onClick={() => toggleHint(2)}>
                                        <span>Hint 2 — Step-by-Step Logic</span>
                                        <span className="hint-chevron">{openHints[2] ? "▲" : "▼"}</span>
                                    </button>
                                    {openHints[2] && (
                                        <div className="hint-body">
                                            <ol className="intuition-steps">
                                                {intuition.steps.map((step, idx) => (
                                                    <li key={idx}>{step}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}
                                </div>

                                <div className="hint-item">
                                    <button className="hint-header" onClick={() => toggleHint(3)}>
                                        <span>Hint 3 — Watch Out & Complexity</span>
                                        <span className="hint-chevron">{openHints[3] ? "▲" : "▼"}</span>
                                    </button>
                                    {openHints[3] && (
                                        <div className="hint-body">
                                            <div className="pitfall-box">
                                                <strong>Watch Out:</strong> {intuition.pitfall}
                                            </div>
                                            <div className="complexity-row">
                                                <span className="complexity-pill">
                                                    <strong>Time:</strong> {intuition.time_complexity}
                                                </span>
                                                <span className="complexity-pill">
                                                    <strong>Space:</strong> {intuition.space_complexity}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Right Panel (60%) */}
                {problem.id === "1068" ? (
                    <SequenceVisualizer
                        apiBase={apiBase}
                        problemId="1068"
                        inputValue={activeInput}
                        runTrigger={runTrigger}
                    />
                ) : (
                    <div
                        className="right-panel"
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#9aa0a6",
                        }}
                    >
                        Visualization for {problem.title} coming next.
                    </div>
                )}
            </div>
        </div>
    );
}