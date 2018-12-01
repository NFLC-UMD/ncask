import {Lb2toLb4DemoApp} from './application';
import {ApplicationConfig} from '@loopback/core';

export {Lb2toLb4DemoApp};

export async function main(options: ApplicationConfig = {}) {
  const app = new Lb2toLb4DemoApp(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
