// Author: CMH
// Title: Learning Shaders


#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform sampler2D u_tex3;
uniform sampler2D u_tex4;
uniform sampler2D u_tex5;
uniform sampler2D u_tex6;
uniform sampler2D u_tex7;

float breathing=(exp(sin(u_time*2.0*3.14159/8.0)) - 0.36787944)*0.42545906412;
float mouseEffect(vec2 uv, vec2 mouse, float size)
{
    float dist=length(uv-mouse);
    return smoothstep(size, size+0.2*(breathing+0.5), dist);  //size
}


void main()
{
    vec2 uv= gl_FragCoord.xy/u_resolution.xy;
    vec2 vUv=fract(6.0*uv);                 //key
    vec4 shadeColor= texture2D(u_tex0, uv); //first reference
    vec4 bgColor= texture2D(u_tex7, uv);     //second reference
    float shading= shadeColor.g;            //取MonaLisa綠色版作為明亮值
    float shadingB= bgColor.g;            //取MonaLisa綠色版作為明亮值
    vec2 mouse=u_mouse.xy/u_resolution.xy;
    
    float value=mouseEffect(uv,mouse,0.1);
    //shading = mix(shadingB, shading, value); //replace


    vec4 c;
                float step = 1. / 6.;
                if( shading <= step ){   
                    c = mix( texture2D( u_tex6, vUv ), texture2D( u_tex5, vUv ), 6. * shading );
                }
                if( shading > step && shading <= 2. * step ){
                    c = mix( texture2D( u_tex5, vUv ), texture2D( u_tex4, vUv) , 6. * ( shading - step ) );
                }
                if( shading > 2. * step && shading <= 3. * step ){
                    c = mix( texture2D( u_tex4, vUv ), texture2D( u_tex3, vUv ), 6. * ( shading - 2. * step ) );
                }
                if( shading > 3. * step && shading <= 4. * step ){
                    c = mix( texture2D( u_tex3, vUv ), texture2D( u_tex2, vUv ), 6. * ( shading - 3. * step ) );
                }
                if( shading > 4. * step && shading <= 5. * step ){
                    c = mix( texture2D( u_tex2, vUv ), texture2D( u_tex1, vUv ), 6. * ( shading - 4. * step ) );
                }
                if( shading > 5. * step ){
                    c = mix( texture2D( u_tex1, vUv ), vec4( 1. ), 6. * ( shading - 5. * step ) );
                }
                
     vec4 inkColor = vec4(0.0, 0.0, 1.0, 1.0);
     vec4 src = mix( mix( inkColor, vec4(1.), c.r ), c, .5 );
     src = mix(src*shadingB, src, value);
     gl_FragColor = src;
}

