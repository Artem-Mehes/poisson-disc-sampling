(async () => {
  const poissonDiskContainer = document.querySelector('#triangle-poisson-disk');

  const getDistanceBetweenPoints = (a, b) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];

    return Math.sqrt(dx * dx + dy * dy);
  };

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
  polygon.setAttribute('fill', 'white');

  poissonDiskContainer.appendChild(polygon);

  const aSide = getDistanceBetweenPoints(A, B);
  const bSide = getDistanceBetweenPoints(B, C);
  const cSide = getDistanceBetweenPoints(C, A);

  const triangleSemiperimerer = (aSide + bSide + cSide) / 2;
  const triangleArea = Math.sqrt(
    triangleSemiperimerer *
      (triangleSemiperimerer - aSide) *
      (triangleSemiperimerer - bSide) *
      (triangleSemiperimerer - cSide)
  );

  const minX = Math.min(A[0], B[0], C[0]);
  const maxX = Math.max(A[0], B[0], C[0]);
  const minY = Math.min(A[1], B[1], C[1]);
  const maxY = Math.max(A[1], B[1], C[1]);

  const minimumDistance = 10;
  const samplesBeforeRejection = 30;

  const sampler = new PoissonDiskSampler(
    maxX,
    maxY,
    minimumDistance,
    samplesBeforeRejection,
    async (point, index) => {
      const circle = getCircle(point.x, point.y, index);

      await new Promise((resolve) => setTimeout(resolve, 15));

      poissonDiskContainer.appendChild(circle);
    }
  );

  await sampler.generatePoints();
})();
