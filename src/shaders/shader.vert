#version 300 es 

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
uniform mat3 u_matrix;

void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
