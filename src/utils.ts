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

export function updateCanvasSize(canvas: HTMLCanvasElement) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

export function getRandomInt(range: number) {
    return Math.floor(Math.random() * range);
}

export class M3 {
    public static translate(x: number, y: number): number[] {
        return [
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        ];
    }

    public static rotate(angleRads: number): number[] {
        const c = Math.cos(angleRads);
        const s = Math.sin(angleRads);

        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ];
    }

    public static scale(x: number, y: number): number[] {
        return [
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        ];
    }

    public static identity(): number[] {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 1, 1
        ];
    }

    public static project(width: number, height: number) {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1,
        ];
    }

    private static mul(a: number[], b: number[]) {
        const a00 = a[0 * 3 + 0];
        const a01 = a[0 * 3 + 1];
        const a02 = a[0 * 3 + 2];
        const a10 = a[1 * 3 + 0];
        const a11 = a[1 * 3 + 1];
        const a12 = a[1 * 3 + 2];
        const a20 = a[2 * 3 + 0];
        const a21 = a[2 * 3 + 1];
        const a22 = a[2 * 3 + 2];
        const b00 = b[0 * 3 + 0];
        const b01 = b[0 * 3 + 1];
        const b02 = b[0 * 3 + 2];
        const b10 = b[1 * 3 + 0];
        const b11 = b[1 * 3 + 1];
        const b12 = b[1 * 3 + 2];
        const b20 = b[2 * 3 + 0];
        const b21 = b[2 * 3 + 1];
        const b22 = b[2 * 3 + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    }

    public static multiply(...matrices: number[][]) {
        let newMat = matrices[0];

        const len = matrices.length;
        for (let i = 1; i < len; i++) {
            newMat = M3.mul(newMat, matrices[i]);
        }

        return newMat;
    }
}
