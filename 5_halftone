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
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
 	vec2 uv=st; //[0~1]
    vec3 color = texture2D(u_tex0, uv).rgb;    
    gl_FragColor = vec4(vec3(color),1.0);
}
