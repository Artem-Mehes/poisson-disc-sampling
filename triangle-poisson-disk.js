(() => {
  const poissonDiskContainer = document.querySelector('#triangle-poisson-disk');

  const A = [10, 300];
  const B = [10, 10];
  const C = [400, 10];

  const polygon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon'
  );

  polygon.setAttribute(
    'points',
    `${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`
  );
  polygon.setAttribute('fill', 'blue');

  poissonDiskContainer.appendChild(polygon);

  // const aSide = Math.hypot;
  // const bSide = ;
  // const cSide = ;

  // console.log(aSide, bSide, cSide);

  const points = [];

  // Draw the points
  points.forEach((point) => {
    const x = point.x;
    const y = point.y;

    const pointElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );

    pointElement.setAttribute('cx', x);
    pointElement.setAttribute('cy', y);
    pointElement.setAttribute('r', 2);
    pointElement.setAttribute('fill', 'white');

    poissonDiskContainer.appendChild(pointElement);
  });

  const showTriangleSideLetter = (points, side) => {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', points[0]);
    text.setAttribute('y', points[1]);
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '20px');
    text.textContent = side;
    poissonDiskContainer.appendChild(text);
  };

  showTriangleSideLetter(A, 'A');
  showTriangleSideLetter(B, 'B');
  showTriangleSideLetter(C, 'C');
})();
