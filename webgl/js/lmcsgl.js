(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], () => factory.call(root));
	} else {
		root.lmcsgl = factory.call(root);
	}
}(this, function() {
	"use strict";

	const FORWARD  = 0;
	const LEFT     = 1;
	const BACKWARD = 2;
	const RIGHT    = 3;

	const MINZOOM  = Math.PI / 180.0;
	const MAXZOOM  = Math.PI / 4.0;
	const MAXPITCH = Math.PI / 2.02;

	class Cam {
		constructor(pos) {
			this.pos     = glMatrix.vec3.clone(pos);
			this.up      = glMatrix.vec3.clone([0, 1, 0]);
			this.lookAt  = glMatrix.vec3.create();
			this.right   = glMatrix.vec3.create();
			this.worldUp = glMatrix.vec3.clone([0, 1, 0]);

			this.yaw   = -Math.PI / 2.0;
			this.pitch = 0.0;
			this.zoom  = Math.PI / 4.0;

			this.mouseSensitivity = 0.01;
			this.zoomSensitivity  = 0.005;

			this.speed = 2.5;

			this.firstMouse = true;
			this.lastX      = 0;
			this.lasty      = 0;

			this.viewM4 = glMatrix.mat4.create();

			this.updateVectors();
		}
		movePov(xpos, ypos) {
			if (this.firstMouse) {
				this.lastX = xpos;
				this.lastY = ypos;
				this.firstMouse = false;
			} else {
				processPov(xpos - lastX, lastY - ypos);
				lastX = xpos;
				lastY = ypos;
			}
		}
		stopPov() {
			this.firstMouse = true;
		}
		processKeyboard(direction, deltaTime) {
			const velocity = this.speed * deltaTime;
			if (direction === FORWARD) {
				pos[0] += lookAt[0] * velocity;
				pos[1] += lookAt[1] * velocity;
				pos[2] += lookAt[2] * velocity;
			} else if (direction === LEFT) {
				pos[0] -= right[0] * velocity;
				pos[1] -= right[1] * velocity;
				pos[2] -= right[2] * velocity;
			} else if (direction === BACKWARD) {
				pos[0] -= lookAt[0] * velocity;
				pos[1] -= lookAt[1] * velocity;
				pos[2] -= lookAt[2] * velocity;
			} else if (direction === RIGHT) {
				pos[0] += right[0] * velocity;
				pos[1] += right[1] * velocity;
				pos[2] += right[2] * velocity;
			}
		}
		processScroll(yoffset) {
			this.zoom -= yoffset * zoomSensitivity;
			if (zoom < MINZOOM) zoom = MINZOOM;
			else if (zoom > MAXZOOM) zoom = MAXZOOM;
		}
		processPov(xoffset, yoffset, constrainPitch) {
			constrainPitch = constrainPitch === undefined? true : constrainPitch;
			yaw   += xoffset * mouseSensitivity;
			pitch += yoffset * mouseSensitivity;
			if (constrainPitch) {
				if (pitch > MAXPITCH) pitch = MAXPITCH;
				else if (pitch < -MAXPITCH) pitch = -MAXPITCH;
			}
			this.updateVectors();
		}
		updateVectors() {
			this.lookAt[0] = Math.cos(this.yaw) * Math.cos(this.pitch);
			this.lookAt[1] = Math.sin(this.pitch);
			this.lookAt[2] = Math.sin(this.yaw) * Math.cos(this.pitch);
			glMatrix.vec3.normalize(this.lookAt, this.lookAt);
			glMatrix.vec3.cross(this.right, this.lookAt, this.worldUp);
			glMatrix.vec3.normalize(this.right, this.right);
			glMatrix.vec3.cross(this.up, this.right, this.lookAt);
			glMatrix.vec3.normalize(this.up, this.up);

			const temp = glMatrix.vec3.create();
			glMatrix.vec3.add(temp, this.pos, this.lookAt);
			glMatrix.mat4.lookAt(this.viewM4, this.pos, temp, this.up);
		}
	};

	class Mesh {
		constructor(gl, shader, params) {
			this.gl = gl;
			this.vertices = params.vertices;
			this.indices = params.indices;
			//this.textures = params.textures;
			this.vao = gl.createVertexArray();

			const vbo = gl.createBuffer();
			const ebo = gl.createBuffer();

			gl.bindVertexArray(this.vao);
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
			gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

			let stride = 0;
			for (const a of params.attribs) stride += a.size;
			stride *= 4;
			let offset = 0;
			for (const a of params.attribs) {
				const attrib = gl.getAttribLocation(shader, a.name);
				gl.enableVertexAttribArray(attrib);
				gl.vertexAttribPointer(attrib, a.size, gl.FLOAT, false, stride, offset);
				offset += a.size * 4;
			}

			gl.bindVertexArray(null);
		}
		draw(/*shader*/) {
			/*let diffuseNr = 1;
	let specularNr = 1;
	let normalNr = 1;
	let heightNr = 1;

	for (let i = 0; i < this.textures.length; ++i) {
		gl.activeTexture(gl.TEXTURE0 + i);
		let number;
		const name = this.textures[i].type;
		if (name === "texture_diffuse") {
			number = `${diffuseNr++}`;
		} else if (name === "texture_specular") {
			number = `${specularNr++}`;
		} else if (name === "texture_normal") {
			number = `${normalNr++}`;
		} else if (name === "texture_height") {
			number = `${heightNr++}`;
		}
		gl.uniform1i(gl.getUniformLocation(shader.pid, name + number), i);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[i].id);
			}*/

			this.gl.bindVertexArray(this.vao);
			this.gl.drawElements(this.gl.TRIANGLES,
				this.indices.length,
				this.gl.UNSIGNED_INT, 0);
			/*this.gl.drawElementsInstanced(
		this.gl.TRIANGLES,
		this.indices.length,
		this.gl.UNSIGNED_INT,
		0,
		translations.length / 2
			);*/
			this.gl.bindVertexArray(null);

			//this.gl.activeTexture(this.gl.TEXTURE0);
		}
	}

	return {
		FORWARD:  FORWARD,
		LEFT:     LEFT,
		BACKWARD: BACKWARD,
		RIGHT:    RIGHT,
		Cam:      Cam,
		Mesh:     Mesh
	};

}));
