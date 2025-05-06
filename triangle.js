const generate = () => {
  const container = document.querySelector('#triangle');

  const A = [10, 200];

  const B = [10, 10];

  const C = [300, 10];

  const polygon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon'
  );

  polygon.setAttribute(
    'points',
    `${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`
  );
  polygon.setAttribute('fill', 'blue');

  container.appendChild(polygon);

  for (let i = 0; i < 250; i++) {
    let u = Math.random();
    let v = Math.random();

    // Flip if the point is outside the triangle
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }

    // Final point = A + u*(B - A) + v*(C - A)
    const x = A[0] + u * (B[0] - A[0]) + v * (C[0] - A[0]);
    const y = A[1] + u * (B[1] - A[1]) + v * (C[1] - A[1]);

    const point = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );

    point.setAttribute('cx', x);
    point.setAttribute('cy', y);
    point.setAttribute('r', 2);
    point.setAttribute('fill', 'white');

    container.appendChild(point);
  }
};

generate();
