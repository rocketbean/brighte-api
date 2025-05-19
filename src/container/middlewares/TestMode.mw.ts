export default async (request, response, next) => {
  if (process.env.testMode == "enabled") next();
};
