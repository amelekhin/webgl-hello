export function createShader(gl: WebGL2RenderingContext, type: number, src: string) {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    const success: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
        const msg = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("Failed to compile shader: " + msg);
    }

    return shader;
}

export function createProgram(gl: WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader) {
    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    const success: boolean = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        const msg = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error("Failed to link program: " + msg);
    }

    return program;
}

export function updateCanvasSize(gl: WebGL2RenderingContext) {
    gl.canvas.width  = gl.canvas.clientWidth;
    gl.canvas.height = gl.canvas.clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

export function getRandomInt(range: number) {
    return Math.floor(Math.random() * range);
}

