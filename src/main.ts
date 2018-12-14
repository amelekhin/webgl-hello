import { createShader, createProgram, updateCanvasSize, setColors, setGeometry, M4 } from "./utils";

function main() {
    // Initialize canvas
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    // Set default canvas size to full screen
    updateCanvasSize(canvas);

    // Initialize gl context
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext | null;

    if (gl === null) {
        alert("WebGL2 is not supported by this browser");
        return;
    }

    // Load shaders' sources
    const vertShaderSrc: string = require("./shaders/shader.vert");
    const fragShaderSrc: string = require("./shaders/shader.frag");

    // Create shaders and program
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    const program = createProgram(gl, vertShader, fragShader);

    // Get the location of a_position attribute
    const posAttrLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer and bind it as ARRAY_BUFFER
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

    // Load vertices of the geometry    
    const geometryVerts = require("./data/f-letter-verts").default;

    // Bind VAO to position attribute
    gl.enableVertexAttribArray(posAttrLocation);

    // Define how to pull data from pos buffer
    gl.vertexAttribPointer(posAttrLocation, 3, gl.FLOAT, false, 0, 0);

    // Pass geometry coords to vertex shader through the array buffer
    setGeometry(gl, geometryVerts, 0, 0);

    const colors = require("./data/f-letter-colors").default;
    const colorBuffer = gl.createBuffer();
    const colorLocation = gl.getAttribLocation(program, "a_color");

    // Bind color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Define how to pull data out from color buffer
    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    // Put data into buffer
    setColors(gl, colors);
    
    gl.enableVertexAttribArray(colorLocation);

    // Update viewport size
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Set clear color
    gl.clearColor(0.95, 0.95, 0.95, 1);

    // Tell GL to use the program
    gl.useProgram(program);

    // Get location of resolution uniform, put data to it
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const resolution = [gl.canvas.width, gl.canvas.height];
    gl.uniform2fv(resolutionLocation, resolution);

    const translation = [gl.canvas.width / 2 - 100, gl.canvas.height / 2 - 100, 0];
    const scale = [1, 1, 1];
    const angles = [0, 0, 0];

    const matLocation = gl.getUniformLocation(program, "u_matrix");

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    const draw = () => {
        // Run animations
        angles[0] += 0.01;
        angles[1] += 0.01;

        const pMat = M4.project(gl.canvas.width, gl.canvas.height, 400);
        const tMat = M4.translate(translation[0], translation[1], translation[2]);
        const rMatX = M4.rotateX(angles[0]);
        const rMatY = M4.rotateY(angles[1]);
        const rMatZ = M4.rotateZ(angles[2]);
        const sMat = M4.scale(scale[0], scale[1], scale[2]);
        const m = M4.multiply(pMat, tMat, rMatX, rMatY, rMatZ, sMat);

        // Apply transformations
        gl.uniformMatrix4fv(matLocation, false, m);

        // Clear screen
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw everything
        gl.drawArrays(gl.TRIANGLES, 0, geometryVerts.length / 3);

        requestAnimationFrame(draw);
    };

    window.addEventListener('keydown', (e) => {
        if (e.shiftKey) {
            const scaleDiff = 0.1;

            if (e.key === 'ArrowUp') {
                scale[1] += scaleDiff;
            }

            if (e.key === 'ArrowDown') {
                scale[1] -= scaleDiff;
            }

            if (e.key === 'ArrowLeft') {
                scale[0] -= scaleDiff;
            }

            if (e.key === 'ArrowRight') {
                scale[0] += scaleDiff;
            }
        }

        else {
            const translationDiff = 20;
            const rotationDiffDegrees = 5;
            const rotationDiffRads = rotationDiffDegrees * Math.PI / 180;

            if (e.code === 'ArrowUp') {
                translation[1] -= translationDiff;
            }

            if (e.code === 'ArrowDown') {
                translation[1] += translationDiff;
            }

            if (e.code === 'ArrowLeft') {
                translation[0] -= translationDiff;
            }

            if (e.code === 'ArrowRight') {
                translation[0] += translationDiff;
            }

            if (e.code === 'Numpad8') {
                angles[0] += rotationDiffRads;
            }

            if (e.code === 'Numpad2') {
                angles[0] -= rotationDiffRads;
            }

            if (e.code === 'Numpad4') {
                angles[1] += rotationDiffRads;
            }

            if (e.code === 'Numpad6') {
                angles[1] -= rotationDiffRads;
            }

            if (e.code === 'Numpad7') {
                angles[2] += rotationDiffRads;
            }

            if (e.code === 'Numpad1') {
                angles[2] -= rotationDiffRads;
            }
        }
    });

    window.addEventListener("resize", () => {
        updateCanvasSize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniform2fv(resolutionLocation, resolution);
    });

    requestAnimationFrame(draw);
}

main();
