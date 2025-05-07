const svgDimensions = {
  width: 500,
  height: 500,
};



const getCircle = (x, y, index) => {
  const circlesRadius = 1;

  const circle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
  );
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', circlesRadius);
  circle.setAttribute('fill', `hsl(${index * 10}, 100%, 50%)`);
  return circle;
};

const uniformRandomGenerator = async () => {
  const uniformRandom = document.querySelector('#uniform-random');

  const samplesMaxCount = 1000;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgDimensions.width);
  svg.setAttribute('height', svgDimensions.height);
  svg.setAttribute('style', 'background-color: black;');
  uniformRandom.appendChild(svg);

  for (let i = 0; i < samplesMaxCount; i++) {
    const x = Math.random();
    const y = Math.random();

    const circle = getCircle(
      x * svgDimensions.width,
      y * svgDimensions.height,
      i
    );

    await new Promise((resolve) => setTimeout(resolve, 15));

    svg.appendChild(circle);
  }
};

const poissonDiskGenerator = async () => {
  const container = document.querySelector('#poisson-disk');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgDimensions.width);
  svg.setAttribute('height', svgDimensions.height);
  svg.setAttribute('style', 'background-color: black;');
  container.appendChild(svg);

  const minimumDistance = 5;
  const samplesBeforeRejection = 30;

  const sampler = new PoissonDiskSampler(
    svgDimensions.width,
    svgDimensions.height,
    minimumDistance,
    samplesBeforeRejection,
    async (point, index) => {
      const circle = getCircle(point.x, point.y, index);

      await new Promise((resolve) => setTimeout(resolve, 15));

      svg.appendChild(circle);
    }
  );

  await sampler.generatePoints();
};

uniformRandomGenerator();
poissonDiskGenerator();
