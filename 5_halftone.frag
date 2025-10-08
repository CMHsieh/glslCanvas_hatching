// Author:CMH
// Title:input image and kernel 

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

// Simple noise function
    float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
    }

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = st; //[0~1]
    vec3 color = texture2D(u_tex0, uv).rgb;

    // Calculate luminance
    float lum = dot(color, vec3(0.299, 0.587, 0.114));

    // Halftone grid settings
    float dotSpacing = 0.01; // distance between dots
    float dotRadius = 0.006;  // base dot radius
    vec2 grid = floor(uv / dotSpacing) * dotSpacing + dotSpacing * 0.5;
    float dist = length(uv - grid);

    // Add noise to dot radius for ink effect
    float noise = rand(grid + u_time);
    float radius = dotRadius * (1.0 - lum) * (0.8 + 0.4 * noise);
    float mask = smoothstep(radius, radius - 0.005, dist);

    // Blend dot pattern with original color
    vec3 halftone = mix(vec3(0.0), vec3(0.0, 0.0, 1.0, 1.0), mask);
    gl_FragColor = vec4(halftone, 1.0);
}
