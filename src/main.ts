import { createShader, createProgram, updateCanvasSize } from "./utils";

function main() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    updateCanvasSize(canvas);

    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
    
    if (gl === null) {
        alert("WebGL2 is not supported by this browser");
        return;
    }

    const vertShaderSrc: string = require("./shader.vert");
    const fragShaderSrc: string = require("./shader.frag");

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    const program = createProgram(gl, vertShader, fragShader);

    const posAttrLocation = gl.getAttribLocation(program, "a_position");
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

    const vertices = new Float32Array([
        -0.3, 0,
        0, 0.5,
        0.3, 0
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posAttrLocation);

    const size       = 2;
    const type       = gl.FLOAT;
    const normalize  = false;
    const stride     = 0;
    const offset     = 0;

    gl.vertexAttribPointer(posAttrLocation, size, type, normalize, stride, offset);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
