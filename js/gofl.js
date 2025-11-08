const _ = !(() => {
	// Useful constants.
	const BOX_SIDE = 4;
	const DELAY = 50;
	const RADIUS = BOX_SIDE >> 1;
	const RAD_START = 0;
	const RAD_END = 2 * Math.PI;
	const FILL_COLOR = "LightSlateGray";
	const STROKE_COLOR = "SlateGray";

	// Canvas info.
	const here = document.getElementById("here");
	const canvas = document.createElement("canvas");
	canvas.width = here.offsetWidth;
	canvas.height = Math.floor(document.documentElement.clientHeight * .6);
	here.appendChild(canvas);
	const cols = Math.floor(canvas.width / BOX_SIDE);
	const rows = Math.floor(canvas.height / BOX_SIDE);
	const context = canvas.getContext("2d");

	// Auxiliar variables.
	let running = true;
	let intervalId;

	// Two dimensional array to hold the cells.
	let cells = new Array(rows);
	let prevGen = new Array(cols);
	for (let i = 0; i < rows; ++i) {
		cells[i] = new Int8Array(cols);
		prevGen[i] = new Int8Array(cols);
		for (let j = 0; j < cols; ++j) {
			cells[i][j] = Math.floor(Math.random() * 100) > 80 ? 1 : 0;
		}
	}

	/** Draws cells represented by 1 values in the cells matrix */
	function drawCells() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.fillStyle = FILL_COLOR;
		context.strokeStyle = STROKE_COLOR;
		for (let i = 0; i < rows; ++i) {
			for (let j = 0; j < cols; ++j) {
				if (cells[i][j] == 1) {
					context.beginPath();
					context.arc(
						j * BOX_SIDE + RADIUS,
						i * BOX_SIDE + RADIUS,
						RADIUS,
						RAD_START,
						RAD_END,
					);
					context.fill();
					context.stroke();
				}
			}
		}
	}

	/**
	 * Get the number of neighbours around the cell at the i, j position.
	 * @return {number} the number of neighbours.
	 */
	function countNeighbours(i, j) {
		let count = 0;
		for (
			const [p, q] of [
				[(i - 1 + rows) % rows, (j - 1 + cols) % cols],
				[(i - 1 + rows) % rows, j],
				[(i - 1 + rows) % rows, (j + 1) % cols],
				[i, (j - 1 + cols) % cols],
				[i, (j + 1) % cols],
				[(i + 1) % rows, (j - 1 + cols) % cols],
				[(i + 1) % rows, j],
				[(i + 1) % rows, (j + 1) % cols],
			]
		) {
			count += prevGen[p][q];
		}
		return count;
	}

	/** The main look of the animation */
	function mainLoop() {
		[cells, prevGen] = [prevGen, cells];
		for (let i = 0; i < rows; ++i) {
			for (let j = 0; j < cols; ++j) {
				const count = countNeighbours(i, j);
				cells[i][j] = count == 3 || (prevGen[i][j] == 1 && count == 2);
			}
		}
		drawCells();
	}

	/** @callback keypress callback */
	document.addEventListener("keypress", (e) => {
		// stoping/resuming main loop.
		if (e.keyCode === 112) { // 'p'
			if (running) {
				clearInterval(intervalId);
			} else {
				intervalId = setInterval(mainLoop, DELAY);
			}
			running = !running;
		}
	});

	/** @callback click callback */
	canvas.addEventListener("click", (e) => {
		const [j, i] = [
			Math.floor((e.x - canvas.offsetLeft) / BOX_SIDE),
			Math.floor((e.y - canvas.offsetTop) / BOX_SIDE),
		];
		cells[i][j] = cells[i][j] == 1 ? 0 : 1;
		drawCells();
	});

	intervalId = setInterval(mainLoop, DELAY);
})();
