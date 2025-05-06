const svgDimensions = {
  width: 500,
  height: 500,
};

const samplesMaxCount = 1000;
const circlesRadius = 2;

const getCircle = (x, y) => {
  const circle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
  );
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', circlesRadius);
  circle.setAttribute('fill', 'white');
  return circle;
};

const uniformRandomGenerator = () => {
  const uniformRandom = document.querySelector('#uniform-random');

  for (let i = 0; i < samplesMaxCount; i++) {
    const x = Math.random();
    const y = Math.random();

    const circle = getCircle(x * svgDimensions.width, y * svgDimensions.height);
    uniformRandom.appendChild(circle);
  }
};

uniformRandomGenerator();

const poissonDiskGenerator = () => {
  const poissonDisk = document.querySelector('#poisson-disk');
  
  const minimumDistance = 10;
  const samplesBeforeRejection = 30;

  const sampler = new PoissonDiskSampler(
    svgDimensions.width,
    svgDimensions.height,
    minimumDistance,
    samplesBeforeRejection
  );

  const points = sampler.generatePoints();

  console.log(points);

  points.forEach((position) => {
    const circle = getCircle(position.x, position.y);
    poissonDisk.appendChild(circle);
  });
};

poissonDiskGenerator();
