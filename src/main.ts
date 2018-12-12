import { createShader, createProgram, updateCanvasSize, M3 } from "./utils";

function setGeometry(gl: WebGL2RenderingContext, verts: number[], x: number, y: number) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
}

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
    const vertShader  = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    const fragShader  = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    const program     = createProgram(gl, vertShader, fragShader);

    // Get the location of a_position attribute
    const posAttrLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer and bind it as ARRAY_BUFFER
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

    // Load vertices of the geometry    
    const geometryVerts = require("./data/f-letter-verts").default;

    // Pass geometry coords to vertex shader through the array buffer
    setGeometry(gl, geometryVerts, 0, 0);

    // Bind VAO to position attribute
    gl.enableVertexAttribArray(posAttrLocation);

    // Define how to pull data from VAO
    gl.vertexAttribPointer(posAttrLocation, 2, gl.FLOAT, false, 0, 0);

    // Update viewport size
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Set clear color
    gl.clearColor(0, 0, 0, 1);

    // Tell GL to use the program
    gl.useProgram(program);

    // Get location of resolution uniform, put data to it
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const resolution = [gl.canvas.width, gl.canvas.height];
    gl.uniform2fv(resolutionLocation, resolution);

    // Put random color in color uniform
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const color = [Math.random(), Math.random(), Math.random(), 1];
    gl.uniform4fv(colorLocation, color);

    let translation = [0, 0];
    let scale = [1, 1];
    let angleRads = 0;

    const matLocation = gl.getUniformLocation(program, "u_matrix");

    const draw = () => {
        const tMat = M3.translate(translation[0], translation[1]);
        const rMat = M3.rotate(angleRads);
        const sMat = M3.scale(scale[0], scale[1]);

        const m = M3.multiply(tMat, rMat, sMat);

        // Clear the screen
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Apply transformations
        gl.uniformMatrix3fv(matLocation, false, m);

        // Draw everything
        gl.drawArrays(gl.TRIANGLES, 0, geometryVerts.length / 2);
    };

    window.addEventListener('keydown', (e) => {
        if (
            e.key !== 'ArrowDown'  && 
            e.key !== 'ArrowUp'    && 
            e.key !== 'ArrowLeft'  && 
            e.key !== 'ArrowRight'
        ) {
            return;
        }

        if (e.shiftKey) {
            const diff = 0.1;

            if (e.key === 'ArrowUp') {
                scale[1] += diff;
            }
    
            if (e.key === 'ArrowDown') {
                scale[1] -= diff;
            }
                
            if (e.key === 'ArrowLeft') {
                scale[0] -= diff;
            }
    
            if (e.key === 'ArrowRight') {
                scale[0] += diff;
            }
        }

        else if (e.ctrlKey || e.metaKey) {
            const diffDegrees = 5;
            const diffRads = diffDegrees * Math.PI / 180;

            if (e.key === 'ArrowLeft') {
                angleRads += diffRads;
            }
    
            if (e.key === 'ArrowRight') {
                angleRads -= diffRads;
            }
        } 
        
        else {
            const diff = 20;

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
        }

        draw();
    });

    window.addEventListener("resize", () => {
        updateCanvasSize(canvas);       
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        const resolution = [gl.canvas.width, gl.canvas.height];
        gl.uniform2fv(resolutionLocation, resolution);

        draw(); 
    });

    draw();
}

main();
