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

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = st; //[0~1]
    vec2 texel = 1.0 / u_resolution.xy;

    // Convert to grayscale for gradient calculation
    float gray = dot(texture2D(u_tex0, uv).rgb, vec3(0.299, 0.587, 0.114));

    // Sobel kernels for gradient
    float Gx = 0.0;
    float Gy = 0.0;
    Gx += -1.0 * dot(texture2D(u_tex0, uv + texel * vec2(-1, -1)).rgb, vec3(0.299, 0.587, 0.114));
    Gx += -2.0 * dot(texture2D(u_tex0, uv + texel * vec2(-1,  0)).rgb, vec3(0.299, 0.587, 0.114));
    Gx += -1.0 * dot(texture2D(u_tex0, uv + texel * vec2(-1,  1)).rgb, vec3(0.299, 0.587, 0.114));
    Gx +=  1.0 * dot(texture2D(u_tex0, uv + texel * vec2( 1, -1)).rgb, vec3(0.299, 0.587, 0.114));
    Gx +=  2.0 * dot(texture2D(u_tex0, uv + texel * vec2( 1,  0)).rgb, vec3(0.299, 0.587, 0.114));
    Gx +=  1.0 * dot(texture2D(u_tex0, uv + texel * vec2( 1,  1)).rgb, vec3(0.299, 0.587, 0.114));

    Gy += -1.0 * dot(texture2D(u_tex0, uv + texel * vec2(-1, -1)).rgb, vec3(0.299, 0.587, 0.114));
    Gy += -2.0 * dot(texture2D(u_tex0, uv + texel * vec2( 0, -1)).rgb, vec3(0.299, 0.587, 0.114));
    Gy += -1.0 * dot(texture2D(u_tex0, uv + texel * vec2( 1, -1)).rgb, vec3(0.299, 0.587, 0.114));
    Gy +=  1.0 * dot(texture2D(u_tex0, uv + texel * vec2(-1,  1)).rgb, vec3(0.299, 0.587, 0.114));
    Gy +=  2.0 * dot(texture2D(u_tex0, uv + texel * vec2( 0,  1)).rgb, vec3(0.299, 0.587, 0.114));
    Gy +=  1.0 * dot(texture2D(u_tex0, uv + texel * vec2( 1,  1)).rgb, vec3(0.299, 0.587, 0.114));

    float gradient = length(vec2(Gx, Gy));
    float grad_norm = clamp(gradient / 4.0, 0.0, 1.0); // Normalize for visualization

    // Normal map from gradient
    vec3 normal;
    normal.xy = vec2(Gx, Gy) / 8.0; // scale for visualization
    normal.z = 1.0;
    normal = normalize(normal);
    normal = normal * 0.5 + 0.5; // map from [-1,1] to [0,1]

    // Output: R=gradient map, G=normal X, B=normal Y
    gl_FragColor = vec4(grad_norm, normal.x, normal.y, 1.0);
}
