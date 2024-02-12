import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
      title: 'Society API',
      description: 'Social Media Api'
    },
    host: 'localhost:8001',
    schemes: ['http']
  };
  
  const outputFile = './swagger-output.json';
  const endpointsFiles = ['./routes/*.js', './app.js'];
  
  swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
  });