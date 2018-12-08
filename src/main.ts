import { createShader, createProgram, updateCanvasSize } from "./utils";

function setGeometry(gl: WebGL2RenderingContext, x: number, y: number) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
        // Left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,
 
          // Top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,
 
          // Middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90
        ]),
        gl.STATIC_DRAW
    );
}

function main() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    updateCanvasSize(canvas);

    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
    
    if (gl === null) {
        alert("WebGL2 is not supported by this browser");
        return;
    }

    const vertShaderSrc: string = require("./shaders/shader.vert");
    const fragShaderSrc: string = require("./shaders/shader.frag");

    const vertShader  = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    const fragShader  = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    const program     = createProgram(gl, vertShader, fragShader);

    const posAttrLocation = gl.getAttribLocation(program, "a_position");
    const posBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posAttrLocation);
    gl.vertexAttribPointer(posAttrLocation, 2, gl.FLOAT, false, 0, 0);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.useProgram(program);

    const resUniformLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resUniformLocation, gl.canvas.width, gl.canvas.height);

    const translationUniformLocation = gl.getUniformLocation(program, "u_translation");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    const translation = [0, 0];
    const color = [Math.random(), Math.random(), Math.random(), 1];

    const draw = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        setGeometry(gl, translation[0], translation[1]);
        gl.uniform2fv(translationUniformLocation, translation);
        gl.uniform4fv(colorUniformLocation, color);
        gl.drawArrays(gl.TRIANGLES, 0, 18);
    };

    window.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
            return;
        }

        const diff = 2;

        if (e.key === 'ArrowUp') {
            translation[1] -= diff;
        }

        if (e.key === 'ArrowDown') {
            translation[1] += diff;
        }

        if (e.key === 'ArrowLeft') {
            translation[0] -= diff;
        }

        if (e.key === 'ArrowRight') {
            translation[0] += diff;
        }

        draw();
    });

    draw();
}

main();
