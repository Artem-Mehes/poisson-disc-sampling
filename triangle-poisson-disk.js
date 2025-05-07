(async () => {
  const poissonDiskContainer = document.querySelector('#triangle-poisson-disk');

  const getDistanceBetweenPoints = (a, b) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];

    return Math.sqrt(dx * dx + dy * dy);
  };

  const a = [10, 300];
  const b = [10, 10];
  const c = [400, 10];

  const polygon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon'
  );

  polygon.setAttribute(
    'points',
    `${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`
  );
  polygon.setAttribute('fill', 'black');

  poissonDiskContainer.appendChild(polygon);

  const minimumDistance = 5;
  const samplesBeforeRejection = 30;

  const sampler = new TrianglePoissonDiskSampler(
    { a, b, c },
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
