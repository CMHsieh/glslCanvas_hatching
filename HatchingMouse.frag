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
uniform sampler2D u_tex8;

float breathing=(exp(sin(u_time*2.0*3.14159/8.0)) - 0.36787944)*0.42545906412;
float mouseEffect(vec2 uv, vec2 mouse, float size)
{
    float dist=length((uv - mouse)* u_resolution / 1000.) ;
    return smoothstep(size, (size + 0.2*(breathing+0.5)) / u_resolution.x * u_resolution.y, dist);  //size 
}

void main()
{
    vec2 uv= gl_FragCoord.xy/u_resolution.xy;
    vec2 vUv=fract(70.*uv * u_resolution / 1000.); //fract(6.0*uv);                 //key
    vec4 shadeColor= texture2D(u_tex0, uv); //取MonaLisa
    float shading= shadeColor.g;            //取MonaLisa綠色版作為明亮值
    vec2 mouse=u_mouse.xy/u_resolution.xy;
    
    float value=mouseEffect(uv,mouse,0.05);

    vec4 c;
    
    float step = 1. / 6.;

    if( shading <= step ){   
        c = texture2D( u_tex6, vUv ); //mix( texture2D( u_tex6, vUv ), texture2D( u_tex5, vUv ), 6. * shading );
    }
    else if( shading > step && shading <= 2. * step ){
        c = texture2D( u_tex5, vUv ) ; //mix( texture2D( u_tex5, vUv ), texture2D( u_tex4, vUv) , 6. * ( shading - step ) );
    }
    else if( shading > 2. * step && shading <= 3. * step ){
        c = texture2D( u_tex4, vUv ); //mix( texture2D( u_tex4, vUv ), texture2D( u_tex3, vUv ), 6. * ( shading - 2. * step ) );
    }
    else if( shading > 3. * step && shading <= 4. * step ){
        c = texture2D( u_tex3, vUv ); // mix( texture2D( u_tex3, vUv ), texture2D( u_tex2, vUv ), 6. * ( shading - 3. * step ) );
    }
    else if( shading > 4. * step && shading <= 5. * step ){
        c = texture2D( u_tex2, vUv ); // mix( texture2D( u_tex2, vUv ), texture2D( u_tex1, vUv ), 6. * ( shading - 4. * step ) );
    }
    else if( shading > 5. * step ){
        c = texture2D( u_tex1, vUv ) ; //mix( texture2D( u_tex1, vUv ), vec4( 1. ), 6. * ( shading - 5. * step ) );
    }


    c = mix( texture2D( u_tex8, vUv ), c , sin(u_time) * uv.y * 4.);

                
    vec4 inkColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 src = mix( mix( inkColor, vec4(1.), c.r ), c, .3 );
    shadeColor = texture2D( u_tex7, uv );
    vec4 mixColor = mix(shadeColor, src, value);
    gl_FragColor = mixColor;
}

