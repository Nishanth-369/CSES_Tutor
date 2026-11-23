import { useState, useEffect, useRef } from "react";

const PRESET_SPEEDS = [0.5, 1.0, 1.25, 1.5, 2.0];

export default function SequenceVisualizer({ apiBase, problemId, inputValue, runTrigger }) {
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [speed, setSpeed] = useState(1.0);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const speedMenuRef = useRef(null);

    useEffect(() => {
        if (!inputValue) return;
        setIsPlaying(false);
        fetch(`${apiBase}/api/trace/${problemId}?n=${encodeURIComponent(inputValue)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.steps) {
                    setSteps(data.steps);
                    setCurrentStep(0);
                }
            });
    }, [apiBase, problemId, inputValue, runTrigger]);

    useEffect(() => {
        if (!isPlaying) return;
        if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }
        const delay = Math.round(900 / speed);
        const timer = setTimeout(() => setCurrentStep((s) => s + 1), delay);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps.length, speed]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (speedMenuRef.current && !speedMenuRef.current.contains(e.target)) {
                setShowSpeedMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const adjustSpeed = (delta) => {
        setSpeed((prev) => {
            const next = Math.round((prev + delta) * 100) / 100;
            return Math.min(3.0, Math.max(0.25, next));
        });
    };

    const active = steps[currentStep];

    return (
        <div className="right-panel">
            <div className="viz-header">
                <strong>Interactive Execution</strong>
                <span className="category-tag">Input: {inputValue}</span>
            </div>

            {active && (
                <div className="viz-canvas">
                    <div className="step-meta">
                        <span className="step-pill">
                            Step {currentStep + 1} / {steps.length}
                        </span>
                        <span className="step-op">{active.operation}</span>
                    </div>

                    <div className="stage-box">
                        {active.sequence.map((val, idx) => {
                            const isLatest = idx === active.sequence.length - 1;
                            return (
                                <div key={idx} className="node-wrap">
                                    <div className={`node-card ${isLatest ? "active" : ""}`}>
                                        {val}
                                    </div>
                                    {idx < active.sequence.length - 1 && (
                                        <span className="node-arrow">→</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="explanation-bar">{active.explanation}</div>
                </div>
            )}

            {/* Bottom Footer */}
            <div className="viz-footer">
                <div className="viz-controls">
                    <div className="controls-left">
                        <button
                            className="btn"
                            onClick={() => {
                                setIsPlaying(false);
                                setCurrentStep((s) => Math.max(0, s - 1));
                            }}
                            disabled={currentStep === 0}
                        >
                            Prev
                        </button>
                        <button
                            className="btn btn-accent"
                            onClick={() => setIsPlaying((p) => !p)}
                        >
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                        <button
                            className="btn"
                            onClick={() => {
                                setIsPlaying(false);
                                setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
                            }}
                            disabled={currentStep >= steps.length - 1}
                        >
                            Next
                        </button>
                        <button
                            className="btn"
                            onClick={() => {
                                setIsPlaying(false);
                                setCurrentStep(0);
                            }}
                        >
                            Reset
                        </button>
                    </div>

                    {/* Right-side Icon + Popover */}
                    <div className="speed-popover-wrap" ref={speedMenuRef}>
                        {showSpeedMenu && (
                            <div className="speed-popover">
                                <div className="speed-popover-header">
                                    <span>Playback speed</span>
                                    <button
                                        className="speed-close-btn"
                                        onClick={() => setShowSpeedMenu(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="speed-readout">{speed.toFixed(2)}x</div>

                                <div className="speed-slider-row">
                                    <button
                                        className="speed-step-btn"
                                        onClick={() => adjustSpeed(-0.25)}
                                        aria-label="Decrease speed"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="range"
                                        className="speed-range"
                                        min="0.25"
                                        max="3"
                                        step="0.05"
                                        value={speed}
                                        onChange={(e) => setSpeed(Number(e.target.value))}
                                    />
                                    <button
                                        className="speed-step-btn"
                                        onClick={() => adjustSpeed(0.25)}
                                        aria-label="Increase speed"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="speed-presets">
                                    {PRESET_SPEEDS.map((preset) => (
                                        <div key={preset} className="preset-col">
                                            <button
                                                className={`preset-pill ${Math.abs(speed - preset) < 0.01 ? "active" : ""
                                                    }`}
                                                onClick={() => setSpeed(preset)}
                                            >
                                                {preset.toFixed(preset % 1 === 0 ? 1 : 2)}
                                            </button>
                                            {preset === 1.0 && (
                                                <span className="preset-sub">Normal</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            className={`speed-trigger-btn ${showSpeedMenu ? "active" : ""}`}
                            onClick={() => setShowSpeedMenu((prev) => !prev)}
                            title="Playback speed"
                        >
                            ⚙ {speed.toFixed(2).replace(/\.00$/, ".0")}x
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}