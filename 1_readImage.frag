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

    // Low pass filter kernel (3x3 Gaussian blur)
    float kernel[9];
    kernel[0] = 1.0/16.0; kernel[1] = 2.0/16.0; kernel[2] = 1.0/16.0;
    kernel[3] = 2.0/16.0; kernel[4] = 4.0/16.0; kernel[5] = 2.0/16.0;
    kernel[6] = 1.0/16.0; kernel[7] = 2.0/16.0; kernel[8] = 1.0/16.0;

    vec2 offset[9];
    offset[0] = vec2(-1, -1);
    offset[1] = vec2( 0, -1);
    offset[2] = vec2( 1, -1);
    offset[3] = vec2(-1,  0);
    offset[4] = vec2( 0,  0);
    offset[5] = vec2( 1,  0);
    offset[6] = vec2(-1,  1);
    offset[7] = vec2( 0,  1);
    offset[8] = vec2( 1,  1);

    vec3 blur = vec3(0.0);
    for (int i = 0; i < 9; i++) {
        vec2 sampleUV = uv + offset[i] * texel;
        blur += texture2D(u_tex0, sampleUV).rgb * kernel[i];
    }
    gl_FragColor = vec4(blur, 1.0);
}