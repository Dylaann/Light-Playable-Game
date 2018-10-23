#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

float field(in vec3 p) {
	float strength = 8. + .03 * log(1.e-6 + fract(-sin(time) * 437.11));
	float accum = 0.5;
	float prev = 0.;
	float tw = 5.;
	for (int i = 0; i < 302; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);
	vec3 p = vec3(uvs / 4., -1) + vec3(1., -1.3, 0.);
	p += 0.05 * vec3(0, 0, sin(time / 32.));
	float t = field(p);
	float v = (5. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
	gl_FragColor = mix(.1, 1., v) * vec4(100 * t * t * t, 10 * t * t, t, 0.5);
}
