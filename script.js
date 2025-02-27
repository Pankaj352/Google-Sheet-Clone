const COLUMNS = 27;
const ROWS = 100;

const headRow = document.querySelector(".body-head-row");
const atCell = document.createElement("div");
atCell.classList.add("col-head", "at-cell");
headRow.appendChild(atCell);
for (let i = 1; i < COLUMNS; i++) {
  const headCell = document.createElement("div");
  headCell.textContent =
    i === 0 ? ` ${String.fromCharCode(i + 64)}` : String.fromCharCode(i + 64);
  headCell.classList.add("col-head");
  headRow.appendChild(headCell);
}

const snocol = document.querySelector(".body-head-col");
for (let i = 0; i < ROWS; i++) {
  const rowCell = document.createElement("div");
  rowCell.classList.add("row-number");
  rowCell.textContent = `${i + 1}`.padStart(3, " ");
  snocol.append(rowCell);
}

const body = document.querySelector(".body");
for (let i = 0; i < ROWS; i++) {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  for (let j = 1; j < COLUMNS; j++) {
    const cell = document.createElement("div");
    cell.id = `${String.fromCharCode(j + 64)}${i + 1}`;
    cell.classList.add("cell");
    cell.contentEditable = "true";
    cell.textContent = " ";
    rowDiv.appendChild(cell);
  }
  body.appendChild(rowDiv);
}

body.addEventListener("click", (e) => {
  if (e.target.classList.contains("cell")) {
    document.querySelectorAll(".cell.selected").forEach((cell) => {
      cell.classList.remove("selected");
    });
    e.target.classList.add("selected");
    e.target.focus();
  }
});

const selectedCellBox = document.querySelector(".selected-cell-box");
const formData = document.querySelector(".filter-form");

formData.addEventListener('change', (e) => {
  const selectedCell = document.querySelector(".cell.selected");
  if (selectedCell) {
    if (e.target.name === "fontsize") {
      selectedCell.style.fontSize = `${e.target.value}px`;
    } else if (e.target.name === "isBold") {
      selectedCell.style.fontWeight = e.target.checked ? 'bold' : 'normal';
    } else if (e.target.name === "isItalic") {
      selectedCell.style.fontStyle = e.target.checked ? 'italic' : 'normal';
    } else if (e.target.name === "isUnderline") {
      selectedCell.style.textDecoration = e.target.checked ? 'underline' : 'none';
    } else if (e.target.name === "textColor") {
      selectedCell.style.color = e.target.value;
    } else if (e.target.name === "bgColor") {
      selectedCell.style.backgroundColor = e.target.value;
    } else if (e.target.name === "align") {
      selectedCell.style.textAlign = e.target.value;
    }
  }
});

// Function to evaluate formulas
function evaluateFormula(formula) {
  try {
    return eval(formula);
  } catch (e) {
    return "Error";
  }
}

// Save and load functionality
function saveData() {
  const data = {};
  document.querySelectorAll('.cell').forEach(cell => {
    data[cell.id] = cell.textContent;
  });
  localStorage.setItem('spreadsheetData', JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('spreadsheetData'));
  if (data) {
    for (const id in data) {
      const cell = document.getElementById(id);
      if (cell) {
        cell.textContent = data[id];
      }
    }
  }
}

// Load data on page load
window.onload = loadData;

// Save data on unload
window.onbeforeunload = saveData;

// Row and Column Management
document.getElementById('addRow').addEventListener('click', () => {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  for (let j = 1; j < COLUMNS; j++) {
    const cell = document.createElement("div");
    cell.id = `${String.fromCharCode(j + 64)}${ROWS + 1}`;
    cell.classList.add("cell");
    cell.contentEditable = "true";
    cell.textContent = " ";
    rowDiv.appendChild(cell);
  }
  body.appendChild(rowDiv);
  const rowCell = document.createElement("div");
  rowCell.classList.add("row-number");
  rowCell.textContent = `${ROWS + 1}`.padStart(3, " ");
  snocol.append(rowCell);
});

document.getElementById('deleteRow').addEventListener('click', () => {
  const lastRow = body.lastChild;
  if (lastRow) {
    body.removeChild(lastRow);
    snocol.removeChild(snocol.lastChild);
  }
});

document.getElementById('addColumn').addEventListener('click', () => {
  const headCell = document.createElement("div");
  headCell.textContent = String.fromCharCode(COLUMNS + 64);
  headCell.classList.add("col-head");
  headRow.appendChild(headCell);

  document.querySelectorAll('.row').forEach(row => {
    const cell = document.createElement("div");
    cell.id = `${String.fromCharCode(COLUMNS + 65)}${row.children.length + 1}`;
    cell.classList.add("cell");
    cell.contentEditable = "true";
    cell.textContent = " ";
    row.appendChild(cell);
  });
});

document.getElementById('deleteColumn').addEventListener('click', () => {
  const lastHeadCell = headRow.lastChild;
  if (lastHeadCell) {
    headRow.removeChild(lastHeadCell);
    document.querySelectorAll('.row').forEach(row => {
      row.removeChild(row.lastChild);
    });
  }
});

// Cell Merging Functionality
document.getElementById('mergeCells').addEventListener('click', () => {
  const selectedCells = document.querySelectorAll('.cell.selected');
  if (selectedCells.length > 1) {
    const mergedValue = Array.from(selectedCells).map(cell => cell.textContent).join(' ');
    const firstCell = selectedCells[0];
    firstCell.textContent = mergedValue;
    firstCell.setAttribute('colspan', selectedCells.length);
    selectedCells.forEach(cell => {
      if (cell !== firstCell) {
        cell.textContent = '';
        cell.style.display = 'none'; // Hide merged cells
      }
    });
  }
});
