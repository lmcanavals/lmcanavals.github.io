"use strict";

class Verto {
	constructor(numVertices, numComps, numIndices) {
		this.numComps = numComps;
		this.vertices = new Float32Array(numVertices * numComps);
		this.indices = new Uint32Array(numIndices * 3);
		this.iv = 0;
		this.ii = 0;
	}
	addVertex(comps) {
		for (let i = 0; i < comps.length; ++i) {
			this.vertices[this.iv * this.numComps + i] = comps[i];
		}
		this.iv++;
	}
	addTriangle(a, b, c) {
		this.indices[this.ii * 3 + 0] = a;
		this.indices[this.ii * 3 + 1] = b;
		this.indices[this.ii * 3 + 2] = c;
		this.ii++;
	}
	addRect(a, b, c, d) {
		this.addTriangle(a, b, c);
		this.addTriangle(b, c, d);
	}
}

function createRGBCube(gl, shader, side) {
	const v = new Verto(8, 6, 6 * 2);
	const pos = side / 2;
	const neg = -pos;
	v.addVertex([neg, neg, pos, 0, 0, 0]);
	v.addVertex([pos, neg, pos, 1, 0, 0]);
	v.addVertex([neg, pos, pos, 0, 1, 0]);
	v.addVertex([pos, pos, pos, 1, 1, 0]);
	v.addVertex([neg, neg, neg, 0, 0, 1]);
	v.addVertex([pos, neg, neg, 1, 0, 1]);
	v.addVertex([neg, pos, neg, 0, 1, 1]);
	v.addVertex([pos, pos, neg, 1, 1, 1]);
	v.addRect(0, 1, 2, 3);
	v.addRect(4, 5, 6, 7);
	v.addRect(0, 4, 2, 6);
	v.addRect(1, 5, 3, 7);
	v.addRect(0, 1, 4, 5);
	v.addRect(2, 3, 6, 7);

	const params = {
		attribs: [
			{ name: "position", size: 3 },
			{ name: "color", size: 3 },
		],
		vertices: v.vertices,
		indices: v.indices,
		textures: [],
	};
	return new lmcsgl.Mesh(gl, shader, params);
}

async function main() {
	const mat4 = glMatrix.mat4;
	const wu = webglUtils;
	const here = document.querySelector("#here");
	const canvas = document.createElement("canvas");
	canvas.width = here.offsetWidth;
	canvas.height = Math.floor(document.documentElement.clientHeight * .6);
	here.appendChild(canvas);
	const gl = canvas.getContext("webgl2");
	if (!gl) return undefined !== console.log("dang, bruh!");

	const vertSrc = await fetch("shdrs/s.vert").then((resp) => resp.text());
	const fragSrc = await fetch("shdrs/s.frag").then((resp) => resp.text());
	const shader = wu.createProgramFromSources(gl, [vertSrc, fragSrc]);

	const modelLoc = gl.getAttribLocation(shader, "model");
	const viewLoc = gl.getUniformLocation(shader, "view");
	const projectionLoc = gl.getUniformLocation(shader, "projection");

	const cam = new lmcsgl.Cam([0, 0, 15]);
	const mesh = createRGBCube(gl, shader, 0.7);

	const axis = new Float32Array([1, 1, 1]);

	const projection = mat4.create();

	const rotPsec = Math.PI / 8;

	let theta = 0;
	let lastTime = 0;
	let deltaTime = 0;
	let aspect = gl.canvas.width / gl.canvas.height;

	// from here
	const gridsize = 5;
	const numInstances = gridsize * gridsize;
	const matrixData = new Float32Array(numInstances * 16);
	const models = [];
	for (let i = 0; i < numInstances; ++i) {
		models.push(new Float32Array(matrixData.buffer, i * 64, 16));
	}
	gl.bindVertexArray(mesh.vao);
	const matrixBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);
	for (let i = 0; i < 4; ++i) {
		const loc = modelLoc + i;
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 64, i * 16);
		gl.vertexAttribDivisor(loc, 1);
	}
	let xxx = 0;
	// to here

	gl.enable(gl.DEPTH_TEST);
	function render(elapsedTime) {
		elapsedTime *= 1e-3;
		deltaTime = elapsedTime - lastTime;
		lastTime = elapsedTime;

		if (wu.resizeCanvasToDisplaySize(gl.canvas)) {
			aspect = gl.canvas.width / gl.canvas.height;
		}
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0.1, 0.1, 0.1, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(shader);
		gl.bindVertexArray(mesh.vao);

		theta += rotPsec * deltaTime;
		mat4.identity(projection);

		mat4.perspective(projection, cam.zoom, aspect, 0.1, 100);

		gl.uniformMatrix4fv(viewLoc, false, cam.viewM4);
		gl.uniformMatrix4fv(projectionLoc, false, projection);

		// from here
		models.forEach((mat, ndx) => {
			const [i, j] = [Math.floor(ndx / gridsize), ndx % gridsize];
			mat4.identity(mat);
			mat4.translate(mat, mat, [i - gridsize / 2, j - gridsize / 2, 0]);
			mat4.rotate(mat, mat, theta, axis);
		});
		if (xxx++ % 1000 == 0) {
			console.log(matrixData);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);
		gl.drawElementsInstanced(
			gl.TRIANGLES,
			mesh.indices.length,
			gl.UNSIGNED_INT,
			0,
			numInstances,
		);
		// to here
		mesh.draw(shader);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();
