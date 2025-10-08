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

// Helper for halftone mask
    float halftoneMask(vec2, uv, float val, float angle) {
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        vec2 uv_rot = rot * (uv - 0.5) + 0.5;
        vec2 grid = floor(uv_rot / dotSpacing) * dotSpacing + dotSpacing * 0.5;
        float dist = length(uv_rot - grid);
        float noise = rand(grid + u_time);
        float radius = dotRadius * val * (0.8 + 0.4 * noise);
        return smoothstep(radius, radius - 0.005, dist);
    }

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = st; //[0~1]
    vec3 color = texture2D(u_tex0, uv).rgb;

    // Convert RGB to CMY
    vec3 cmy = 1.0 - color;
    float k = min(cmy.x, min(cmy.y, cmy.z));
    vec3 cmyk = vec3((cmy.x - k) / (1.0 - k + 1e-5), (cmy.y - k) / (1.0 - k + 1e-5), (cmy.z - k) / (1.0 - k + 1e-5));
    // cmyk = (C, M, Y), k = K

    float dotSpacing = 0.01;
    float dotRadius = 0.006;

    // Angles for CMYK dots (in radians)
    float angleC = radians(15.0);
    float angleM = radians(75.0);
    float angleY = radians(0.0);
    float angleK = radians(45.0);

    

    // Get masks for each channel
    float maskC = halftoneMask(cmyk.x, angleC);
    float maskM = halftoneMask(cmyk.y, angleM);
    float maskY = halftoneMask(cmyk.z, angleY);
    float maskK = halftoneMask(k, angleK);

    // Composite CMYK dots (additive, but clamp to 1)
    vec3 cmykColor = vec3(0.0);
    cmykColor += vec3(0.0, 1.0, 1.0) * maskC; // Cyan
    cmykColor += vec3(1.0, 0.0, 1.0) * maskM; // Magenta
    cmykColor += vec3(1.0, 1.0, 0.0) * maskY; // Yellow
    cmykColor += vec3(0.0) * maskK;           // Black (optional, can add black dots)
    cmykColor = clamp(cmykColor, 0.0, 1.0);

    gl_FragColor = vec4(cmykColor, 1.0);
}
