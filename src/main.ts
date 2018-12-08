import { createShader, createProgram, updateCanvasSize } from "./utils";

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

    // Get the location of translation uniform, create an array for storing translation data
    const translationLocation = gl.getUniformLocation(program, "u_translation");
    const translation = [0, 0];

    // Get the location of rotation uniform, create an array for storing rotation data
    const rotationLocation = gl.getUniformLocation(program, "u_rotation");
    const rotation = [0, 1]; // Sin and Cos of angle
    let angle = 0;

    // Get the location of scale uniform, create an array for storing scale data
    const scaleLocation = gl.getUniformLocation(program, "u_scale");
    const scale = [1, 1];

    const draw = () => {
        // Clear the screen
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Pass translation data to vertex shader
        gl.uniform2fv(translationLocation, translation);

        // Pass rotation data to vertex shader
        gl.uniform2fv(rotationLocation, rotation);

        // Pass scale data to vertex shader
        gl.uniform2fv(scaleLocation, scale);

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

        else if (e.ctrlKey) {
            const diff = 10;

            if (e.key === 'ArrowLeft') {
                angle += diff;
            }
    
            if (e.key === 'ArrowRight') {
                angle -= diff;
            }

            rotation[0] = Math.sin(angle * Math.PI / 180);
            rotation[1] = Math.cos(angle * Math.PI / 180);
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
