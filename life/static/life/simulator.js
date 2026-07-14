const rows = 36;
const columns = 48;
const canvas = document.querySelector("#lifeCanvas");
const context = canvas.getContext("2d");
const rulesets = JSON.parse(document.querySelector("#rulesets-data").textContent);
const presetPatterns = JSON.parse(document.querySelector("#preset-patterns-data").textContent);
const savedPatterns = JSON.parse(document.querySelector("#saved-patterns-data").textContent);
const selectedPattern = JSON.parse(document.querySelector("#selected-pattern-data").textContent);

const state = {
    cells: new Set(),
    generation: 0,
    running: false,
    timer: null,
    birth: new Set([3]),
    survival: new Set([2, 3]),
    drawing: false,
    drawAlive: true,
};

const els = {
    generation: document.querySelector("#generationCount"),
    live: document.querySelector("#liveCount"),
    play: document.querySelector("#playToggle"),
    step: document.querySelector("#stepButton"),
    clear: document.querySelector("#clearButton"),
    random: document.querySelector("#randomButton"),
    speed: document.querySelector("#speedRange"),
    brush: document.querySelector("#brushRange"),
    ruleset: document.querySelector("#rulesetSelect"),
    birthChecks: document.querySelector("#birthChecks"),
    survivalChecks: document.querySelector("#survivalChecks"),
    ruleOutput: document.querySelector("#ruleOutput"),
    pattern: document.querySelector("#patternSelect"),
    stamp: document.querySelector("#stampButton"),
    form: document.querySelector("#savePatternForm"),
    name: document.querySelector("#id_name"),
    ruleString: document.querySelector("#id_rule_string"),
    formRows: document.querySelector("#id_rows"),
    formColumns: document.querySelector("#id_columns"),
    cellsPayload: document.querySelector("#id_cells_payload"),
};

const cellSize = Math.floor(canvas.width / columns);

function key(row, column) {
    return `${row},${column}`;
}

function parseKey(value) {
    return value.split(",").map(Number);
}

function normalizeRule(rule) {
    const [birthPart = "", survivalPart = ""] = rule.toUpperCase().split("/");
    return {
        birth: new Set([...birthPart.replace("B", "")].map(Number).filter(Number.isInteger)),
        survival: new Set([...survivalPart.replace("S", "")].map(Number).filter(Number.isInteger)),
    };
}

function ruleString() {
    const birth = [...state.birth].sort((a, b) => a - b).join("");
    const survival = [...state.survival].sort((a, b) => a - b).join("");
    return `B${birth}/S${survival}`;
}

function buildRuleChecks() {
    for (let value = 0; value <= 8; value += 1) {
        els.birthChecks.appendChild(ruleCheckbox("birth", value));
        els.survivalChecks.appendChild(ruleCheckbox("survival", value));
    }
}

function ruleCheckbox(kind, value) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = value;
    input.addEventListener("change", () => {
        state[kind][input.checked ? "add" : "delete"](value);
        updateRuleControls();
    });
    label.append(input, document.createTextNode(value));
    return label;
}

function updateRuleControls() {
    [...els.birthChecks.querySelectorAll("input")].forEach((input) => {
        input.checked = state.birth.has(Number(input.value));
    });
    [...els.survivalChecks.querySelectorAll("input")].forEach((input) => {
        input.checked = state.survival.has(Number(input.value));
    });
    els.ruleOutput.textContent = ruleString();
    els.ruleString.value = ruleString();
}

function applyRule(rule) {
    const parsed = normalizeRule(rule);
    state.birth = parsed.birth;
    state.survival = parsed.survival;
    updateRuleControls();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fbfcf8";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#d5ded8";
    context.lineWidth = 1;

    for (let row = 0; row <= rows; row += 1) {
        const y = row * cellSize + 0.5;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(columns * cellSize, y);
        context.stroke();
    }

    for (let column = 0; column <= columns; column += 1) {
        const x = column * cellSize + 0.5;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, rows * cellSize);
        context.stroke();
    }

    context.fillStyle = "#10201e";
    state.cells.forEach((cell) => {
        const [row, column] = parseKey(cell);
        context.fillRect(column * cellSize + 1, row * cellSize + 1, cellSize - 1, cellSize - 1);
    });

    els.generation.textContent = state.generation;
    els.live.textContent = state.cells.size;
}

function neighborCount(row, column) {
    let count = 0;
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
            if (rowOffset === 0 && columnOffset === 0) continue;
            const nextRow = (row + rowOffset + rows) % rows;
            const nextColumn = (column + columnOffset + columns) % columns;
            if (state.cells.has(key(nextRow, nextColumn))) count += 1;
        }
    }
    return count;
}

function step() {
    // Only live cells and their neighbors can change, so evaluate that small
    // candidate set instead of scanning every cell on every generation.
    const candidates = new Set();
    state.cells.forEach((cell) => {
        const [row, column] = parseKey(cell);
        candidates.add(cell);
        for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
            for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
                candidates.add(key((row + rowOffset + rows) % rows, (column + columnOffset + columns) % columns));
            }
        }
    });

    const nextCells = new Set();
    candidates.forEach((cell) => {
        const [row, column] = parseKey(cell);
        const live = state.cells.has(cell);
        const neighbors = neighborCount(row, column);
        if ((live && state.survival.has(neighbors)) || (!live && state.birth.has(neighbors))) {
            nextCells.add(cell);
        }
    });

    state.cells = nextCells;
    state.generation += 1;
    draw();
}

function play() {
    state.running = true;
    els.play.textContent = "Pause";
    state.timer = window.setInterval(step, Number(els.speed.value));
}

function pause() {
    state.running = false;
    els.play.textContent = "Play";
    window.clearInterval(state.timer);
}

function resetGeneration() {
    state.generation = 0;
}

function setCellFromPointer(event) {
    // Convert the pointer position from the responsive canvas back to the
    // fixed simulation grid before applying the selected brush size.
    const rect = canvas.getBoundingClientRect();
    const column = Math.floor(((event.clientX - rect.left) / rect.width) * columns);
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * rows);
    const brush = Number(els.brush.value);
    const offset = Math.floor(brush / 2);

    for (let rowOffset = 0; rowOffset < brush; rowOffset += 1) {
        for (let columnOffset = 0; columnOffset < brush; columnOffset += 1) {
            const targetRow = row + rowOffset - offset;
            const targetColumn = column + columnOffset - offset;
            if (targetRow < 0 || targetRow >= rows || targetColumn < 0 || targetColumn >= columns) continue;
            const cellKey = key(targetRow, targetColumn);
            if (state.drawAlive) {
                state.cells.add(cellKey);
            } else {
                state.cells.delete(cellKey);
            }
        }
    }
    resetGeneration();
    draw();
}

function populatePatterns() {
    const groups = [
        ["Starter patterns", presetPatterns],
        ["Saved patterns", savedPatterns],
    ];
    groups.forEach(([label, patterns]) => {
        if (!patterns.length) return;
        const group = document.createElement("optgroup");
        group.label = label;
        patterns.forEach((pattern, index) => {
            const option = document.createElement("option");
            option.value = `${label}-${index}`;
            option.dataset.pattern = JSON.stringify(pattern);
            option.textContent = `${pattern.name} · ${pattern.rule}`;
            group.appendChild(option);
        });
        els.pattern.appendChild(group);
    });
}

function stampPattern(pattern, center = true) {
    const sourceRows = pattern.rows || Math.max(...pattern.cells.map((cell) => cell[0]), 0) + 1;
    const sourceColumns = pattern.columns || Math.max(...pattern.cells.map((cell) => cell[1]), 0) + 1;
    const rowOffset = center ? Math.floor((rows - sourceRows) / 2) : 0;
    const columnOffset = center ? Math.floor((columns - sourceColumns) / 2) : 0;

    state.cells.clear();
    pattern.cells.forEach(([row, column]) => {
        const targetRow = row + rowOffset;
        const targetColumn = column + columnOffset;
        if (targetRow >= 0 && targetRow < rows && targetColumn >= 0 && targetColumn < columns) {
            state.cells.add(key(targetRow, targetColumn));
        }
    });
    resetGeneration();
    applyRule(pattern.rule || "B3/S23");
    draw();
}

function selectedPatternData() {
    const selected = els.pattern.selectedOptions[0];
    return JSON.parse(selected.dataset.pattern);
}

function randomize() {
    state.cells.clear();
    for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
            if (Math.random() < 0.22) state.cells.add(key(row, column));
        }
    }
    resetGeneration();
    draw();
}

function wireEvents() {
    els.play.addEventListener("click", () => (state.running ? pause() : play()));
    els.step.addEventListener("click", step);
    els.clear.addEventListener("click", () => {
        state.cells.clear();
        resetGeneration();
        draw();
    });
    els.random.addEventListener("click", randomize);
    els.speed.addEventListener("input", () => {
        if (state.running) {
            pause();
            play();
        }
    });
    els.ruleset.addEventListener("change", () => applyRule(els.ruleset.value));
    els.stamp.addEventListener("click", () => stampPattern(selectedPatternData()));

    canvas.addEventListener("pointerdown", (event) => {
        const rect = canvas.getBoundingClientRect();
        const column = Math.floor(((event.clientX - rect.left) / rect.width) * columns);
        const row = Math.floor(((event.clientY - rect.top) / rect.height) * rows);
        state.drawAlive = !state.cells.has(key(row, column));
        state.drawing = true;
        canvas.setPointerCapture(event.pointerId);
        setCellFromPointer(event);
    });
    canvas.addEventListener("pointermove", (event) => {
        if (state.drawing) setCellFromPointer(event);
    });
    canvas.addEventListener("pointerup", () => {
        state.drawing = false;
    });

    els.form.addEventListener("submit", () => {
        // Copy the live canvas state into hidden Django form fields immediately
        // before submission so the server saves what the user sees.
        els.ruleString.value = ruleString();
        els.formRows.value = rows;
        els.formColumns.value = columns;
        els.cellsPayload.value = JSON.stringify([...state.cells].map(parseKey).sort((a, b) => a[0] - b[0] || a[1] - b[1]));
    });
}

buildRuleChecks();
populatePatterns();
wireEvents();
applyRule("B3/S23");

if (selectedPattern) {
    stampPattern(selectedPattern);
    els.name.value = `${selectedPattern.name} remix`;
} else if (presetPatterns.length) {
    stampPattern(presetPatterns[0]);
    els.name.value = "My Life Pattern";
} else {
    draw();
}
