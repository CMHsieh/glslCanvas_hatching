// Author: CMH
// Title: Horizontal Blur + FBO 

#ifdef GL_ES
precision mediump float;
#endif

#if defined( BUFFER_0 )
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_frame;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_buffer0;

vec2 pixelization(vec2 uv, float size) //from 1 to 10
{
    vec2 uvs=uv/ size;//[0~6]
    vec2 ipos = floor(uvs);  // get the integer coords
    vec2 fpos = fract(uvs);  // get the fractional coords
    vec2 nuv=ipos*size;
    return nuv;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float pixelSize=1.;    
    vec2 uv = st;//pixelization(gl_FragCoord.xy, pixelSize)/ u_resolution.xy;//st; //[0~1]
    vec2 mouse= u_mouse.xy / u_resolution.xy;
    vec2 texel = pixelSize* 1.0 / u_resolution.xy ;

    // Gaussian kernels
    float kernelSmall[9];
    kernelSmall[0] = 0.0/16.0; kernelSmall[1] = 0.0/16.0; kernelSmall[2] = 0.0/16.0;
    kernelSmall[3] = 4.0/16.0; kernelSmall[4] = 8.0/16.0; kernelSmall[5] = 4.0/16.0;
    kernelSmall[6] = 0.0/16.0; kernelSmall[7] = 0.0/16.0; kernelSmall[8] = 0.0/16.0;
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
    for (int i = 0; i < 9; i++) {
        vec2 sampleUV = uv + offset[i] * texel;
        blurSmall += texture2D(u_buffer0, sampleUV).rgb * kernelSmall[i];
    }
    vec3 lowpass = 1.0 * blurSmall;

 

    // initial
    if(u_time<1.0) gl_FragColor = texture2D(u_tex1, st);
    //else if (mod(u_time, 4.0)<=1.0) gl_FragColor = texture2D(u_buffer0, st);
    else gl_FragColor = vec4(lowpass, 1.0);
    
    

}