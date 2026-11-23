from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROBLEMS = [
    {
        "id": "1068",
        "title": "Weird Algorithm",
        "category": "Introductory Problems",
        "difficulty": "Easy",
        "implemented": True,
        "simplified_statement": (
            "You are given a positive integer n. Repeat a simple rule until n reaches 1: "
            "if n is even, divide it by 2; if n is odd, multiply it by 3 and add 1. "
            "Record every value of n along the way."
        ),
        "input_spec": "The only input line contains a single integer n (1 ≤ n ≤ 10⁶).",
        "output_spec": "Print a line containing all values of n during the algorithm, separated by spaces.",
        "sample_input": "3",
        "sample_output": "3 10 5 16 8 4 2 1",
        "intuition": {
            "key_idea": "Directly simulate the Collatz rules using a loop until n becomes 1.",
            "steps": [
                "Start with the input value n and record it.",
                "Keep looping as long as n is not equal to 1.",
                "If n is even (n % 2 == 0), divide n by 2.",
                "If n is odd, multiply n by 3 and add 1.",
                "Stop once n reaches 1."
            ],
            "pitfall": "32-bit integer overflow! Even though n ≤ 10⁶, intermediate values (like for n = 113,383) exceed 2.14 × 10⁹. Use a 64-bit integer (long long in C++).",
            "time_complexity": "Length of sequence (fast for n ≤ 10⁶)",
            "space_complexity": "O(1) extra space"
        },
    },
    {
        "id": "1083",
        "title": "Missing Number",
        "category": "Introductory Problems",
        "difficulty": "Easy",
        "implemented": False,
        "simplified_statement": "Given all numbers from 1 to n except one, find the missing number.",
        "input_spec": "First line: integer n. Second line: n - 1 distinct integers.",
        "output_spec": "Print the missing number.",
        "sample_input": "5\n2 3 1 5",
        "sample_output": "4",
        "intuition": {
            "key_idea": "Use the arithmetic series formula to find the expected sum, then subtract the actual sum.",
            "steps": [
                "Calculate expected sum = n × (n + 1) / 2.",
                "Add up all n - 1 given numbers.",
                "The difference (expected - actual) is the missing number."
            ],
            "pitfall": "n × (n + 1) can overflow a 32-bit integer when n = 2 × 10⁵. Use 64-bit integers.",
            "time_complexity": "O(n)",
            "space_complexity": "O(1)"
        },
    },
    {
        "id": "1069",
        "title": "Repetitions",
        "category": "Introductory Problems",
        "difficulty": "Easy",
        "implemented": False,
        "simplified_statement": "Find the length of the longest consecutive streak of the same character in a DNA string.",
        "input_spec": "A single line containing a string of characters A, C, G, and T.",
        "output_spec": "Print one integer: the length of the longest repetition.",
        "sample_input": "ATTCGGGA",
        "sample_output": "3",
        "intuition": {
            "key_idea": "Do a single linear scan while tracking the current streak and the best streak seen so far.",
            "steps": [
                "Start with current_streak = 1 and max_streak = 1.",
                "Compare each character with the previous one.",
                "If they match, increment current_streak; otherwise reset it to 1.",
                "Update max_streak whenever current_streak is larger."
            ],
            "pitfall": "Forgetting to handle a 1-character string (the answer should be 1, not 0).",
            "time_complexity": "O(n)",
            "space_complexity": "O(1)"
        },
    },
]

@app.get("/api/problems")
def get_problems(q: str = "", category: str = ""):
    results = PROBLEMS
    if category and category != "All":
        results = [p for p in results if p["category"] == category]
    if q:
        results = [p for p in results if q.lower() in p["title"].lower() or q in p["id"]]
    return results

@app.get("/api/trace/1068")
def trace_weird_algorithm(n: int = 3):
    if n < 1 or n > 1000000:
        raise HTTPException(status_code=400, detail="Please enter n between 1 and 1,000,000.")

    steps = []
    sequence = [n]
    step_num = 0

    steps.append({
        "step": step_num,
        "current": n,
        "operation": "Initialize",
        "explanation": f"Start with initial value n = {n}.",
        "sequence": list(sequence),
    })

    while n != 1:
        step_num += 1
        prev = n
        if n % 2 == 0:
            n = n // 2
            op = f"{prev} is even → {prev} ÷ 2 = {n}"
            expl = f"Since {prev} is even, divide by 2 to get {n}."
        else:
            n = 3 * n + 1
            op = f"{prev} is odd → 3 × {prev} + 1 = {n}"
            expl = f"Since {prev} is odd, multiply by 3 and add 1 to get {n}."

        sequence.append(n)
        steps.append({
            "step": step_num,
            "current": n,
            "operation": op,
            "explanation": expl,
            "sequence": list(sequence),
        })

    steps.append({
        "step": step_num + 1,
        "current": 1,
        "operation": "Terminate",
        "explanation": "n has reached 1. The algorithm terminates.",
        "sequence": list(sequence),
    })

    return {"problem_id": "1068", "steps": steps}