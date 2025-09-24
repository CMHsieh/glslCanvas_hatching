// Author:CMH
// Title:GlowSquare

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float glow(float d, float str, float thickness){
    return thickness / pow(max(d,0.0), str);
}

float square(vec2 P, float size)
{
    return max(abs(P.x), abs(P.y)) - size/(1.0);
}

float sdCircle( vec2 p, float r )
{
    return (length(p) - r);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;
    uv=fract(uv*1.0);
    uv= uv*2.0-1.0;

    //定義框
    float Pattern=  square(uv, 0.174); //Pattern=sdCircle(uv, 0.154);
    //Pattern=step(0.02, Pattern);//-step(0.06, Pattern);
    //float glow = glow(Pattern , 0.5, 0.132);
    gl_FragColor = vec4(vec3(Pattern),1.0);
}



