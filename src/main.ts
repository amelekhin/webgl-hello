import { createShader, createProgram, updateCanvasSize } from "./utils";

function randomInt(range: number) {
    return Math.floor(Math.random() * range);
}

function setRectangle(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);
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
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(program);
    const resUniformLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resUniformLocation, gl.canvas.width, gl.canvas.height);

    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    for (let i = 0; i < 50; i++) {
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

main();
