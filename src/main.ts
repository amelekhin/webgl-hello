import { M4 } from "./lib/M4";
import { createShader, createProgram, updateCanvasSize } from "./lib/utils";

function main() {
    // Initialize canvas
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    // Initialize gl context
    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        alert("WebGL2 is not supported by this browser");
        return;
    }

    // Create vertex shader
    const vertShaderSrc: string = require("./shaders/shader.vert");
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);

    // Create fragment shader
    const fragShaderSrc: string = require("./shaders/shader.frag");
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);

    // Create program
    const program = createProgram(gl, vertShader, fragShader);

    // Delete vertex shader
    gl.detachShader(program, vertShader);
    gl.deleteShader(vertShader);

    // Delete fragment shader
    gl.detachShader(program, fragShader);
    gl.deleteShader(fragShader);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getAttribLocation(program, "a_color");

    // Define VAO
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Pass positions data
    const positions = require("./data/f-letter-verts").default;
    const positionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Pass colors data
    const colors = require("./data/f-letter-colors").default;
    const colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    // Set default canvas size to full screen
    updateCanvasSize(gl);

    // Set clear color
    gl.clearColor(0.95, 0.95, 0.95, 1);

    // Tell GL to use the program
    gl.useProgram(program);

    const translation = [gl.canvas.width / 2 - 100, gl.canvas.height / 2 - 100, 0];
    const scale = [1, 1, 1];
    const angles = [0.2, 0.3, 0.1];

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    const matUniformLocation = gl.getUniformLocation(program, "u_matrix");

    const draw = () => {
        const pMat  = M4.project(gl.canvas.width, gl.canvas.height, 400);
        const tMat  = M4.translate(translation[0], translation[1], translation[2]);
        const rMatX = M4.rotateX(angles[0]);
        const rMatY = M4.rotateY(angles[1]);
        const rMatZ = M4.rotateZ(angles[2]);
        const sMat  = M4.scale(scale[0], scale[1], scale[2]);
        const m     = M4.multiply(pMat, tMat, rMatX, rMatY, rMatZ, sMat);

        // Apply transformations
        gl.uniformMatrix4fv(matUniformLocation, false, m);

        // Clear screen
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw everything
        gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

        // Request next frame
        requestAnimationFrame(draw);
    };


    // Transformation controls
    window.addEventListener('keydown', (e) => {
        // Scaling controls
        const scaleDiff = 0.1;

        if (e.key === '+') {
            scale[0] += scaleDiff;
            scale[1] += scaleDiff;
            scale[2] += scaleDiff;
        }

        if (e.key === '-') {
            scale[0] -= scaleDiff;
            scale[1] -= scaleDiff;
            scale[2] -= scaleDiff;
        }

        // Translation controls
        const translationDiff = 20;

        if (e.key === 'ArrowUp') {
            translation[1] -= translationDiff;
        }

        if (e.key === 'ArrowDown') {
            translation[1] += translationDiff;
        }

        if (e.key === 'ArrowLeft') {
            translation[0] -= translationDiff;
        }

        if (e.key === 'ArrowRight') {
            translation[0] += translationDiff;
        }

        if (e.key === '1') {
            translation[2] -= translationDiff;
        }

        if (e.key === '2') {
            translation[2] += translationDiff;
        }

        // Rotation controls
        const rotationDiffDegrees = 5;
        const rotationDiffRads = rotationDiffDegrees * Math.PI / 180;

        if (e.key === 'w') {
            angles[0] += rotationDiffRads;
        }

        if (e.key === 's') {
            angles[0] -= rotationDiffRads;
        }

        if (e.key === 'q') {
            angles[1] += rotationDiffRads;
        }

        if (e.key === 'e') {
            angles[1] -= rotationDiffRads;
        }

        if (e.key === 'a') {
            angles[2] += rotationDiffRads;
        }

        if (e.key === 'd') {
            angles[2] -= rotationDiffRads;
        }
    });


    // Update canvas size on window resize
    window.addEventListener("resize", () => {
        updateCanvasSize(gl);
    });


    // Render all the things
    requestAnimationFrame(draw);
}

main();
