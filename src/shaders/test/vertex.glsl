#define PI 3.1415926535897932384626433832795

uniform float uTime;

varying vec2 vUv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.x += sin(modelPosition.z * PI + uTime) + cos(modelPosition.z * PI + uTime);
  modelPosition.z += sin(modelPosition.x * PI + uTime) + cos(modelPosition.x * PI + uTime);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
}
