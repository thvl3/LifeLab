const canvas = document.querySelector("#patternPreview");
const context = canvas.getContext("2d");
const pattern = JSON.parse(document.querySelector("#detail-pattern-data").textContent);

const cellSize = Math.max(6, Math.floor(Math.min(canvas.width / pattern.columns, canvas.height / pattern.rows)));
const width = pattern.columns * cellSize;
const height = pattern.rows * cellSize;
const xOffset = Math.floor((canvas.width - width) / 2);
const yOffset = Math.floor((canvas.height - height) / 2);

context.fillStyle = "#fbfcf8";
context.fillRect(0, 0, canvas.width, canvas.height);
context.strokeStyle = "#d5ded8";
context.lineWidth = 1;

for (let row = 0; row <= pattern.rows; row += 1) {
    const y = yOffset + row * cellSize + 0.5;
    context.beginPath();
    context.moveTo(xOffset, y);
    context.lineTo(xOffset + width, y);
    context.stroke();
}

for (let column = 0; column <= pattern.columns; column += 1) {
    const x = xOffset + column * cellSize + 0.5;
    context.beginPath();
    context.moveTo(x, yOffset);
    context.lineTo(x, yOffset + height);
    context.stroke();
}

context.fillStyle = "#10201e";
pattern.cells.forEach(([row, column]) => {
    context.fillRect(
        xOffset + column * cellSize + 1,
        yOffset + row * cellSize + 1,
        cellSize - 1,
        cellSize - 1
    );
});
