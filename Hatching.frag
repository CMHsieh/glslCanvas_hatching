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



void main()
{
    vec2 uv= gl_FragCoord.xy/u_resolution.xy;
    vec2 vUv=fract(6.0*uv);                        //key
    float shading= texture2D(u_tex0, uv).r*6 + texture2D(u_tex0, uv).g*3 + texture2D(u_tex0, uv).b ; //取MonaLisa綠色版作為明亮值


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
                
     vec4 inkColor = vec4(0.0, 0.0, 1.0, 1.0);
     vec4 src = mix( mix( inkColor, vec4( 1. ), c.r ), c, .5 );
     gl_FragColor = src;


    

}

