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

    // Multi-scale Gaussian kernels
    float kernelSmall[9];
    kernelSmall[0] = 1.0/16.0; kernelSmall[1] = 2.0/16.0; kernelSmall[2] = 1.0/16.0;
    kernelSmall[3] = 2.0/16.0; kernelSmall[4] = 4.0/16.0; kernelSmall[5] = 2.0/16.0;
    kernelSmall[6] = 1.0/16.0; kernelSmall[7] = 2.0/16.0; kernelSmall[8] = 1.0/16.0;

    float kernelLarge[9];
    kernelLarge[0] = 1.0/64.0; kernelLarge[1] = 6.0/64.0; kernelLarge[2] = 1.0/64.0;
    kernelLarge[3] = 6.0/64.0; kernelLarge[4] = 36.0/64.0; kernelLarge[5] = 6.0/64.0;
    kernelLarge[6] = 1.0/64.0; kernelLarge[7] = 6.0/64.0; kernelLarge[8] = 1.0/64.0;

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

    // Low pass: combine small and large blur on u_tex0
    vec3 blurSmall = vec3(0.0);
    vec3 blurLarge = vec3(0.0);
    for (int i = 0; i < 9; i++) {
        vec2 sampleUV = uv + offset[i] * texel;
        blurSmall += texture2D(u_tex0, sampleUV).rgb * kernelSmall[i];
        blurLarge += texture2D(u_tex0, sampleUV).rgb * kernelLarge[i];
    }
    vec3 lowpass = 0.5 * blurSmall + 0.5 * blurLarge;

    // High pass: small kernel on u_tex1
    vec3 img2 = texture2D(u_tex1, uv).rgb;
    vec3 img2_blurSmall = vec3(0.0);
    for (int i = 0; i < 9; i++) {
        vec2 sampleUV = uv + offset[i] * texel;
        img2_blurSmall += texture2D(u_tex1, sampleUV).rgb * kernelSmall[i];
    }
    vec3 highpass = img2 - img2_blurSmall;

    // Multi-scale hybrid blend
    float lowpassWeight = 1.0;
    float highpassWeight = 1.0;
    vec3 hybrid = lowpass * lowpassWeight + highpass * highpassWeight;
    gl_FragColor = vec4(hybrid, 1.0);
}