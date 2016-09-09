var dbURIs = {
  test: "mongodb://localhost/project04-test",
  development: "mongodb://localhost/project04",
  production: process.env.MONGODB_URI || "mongodb://localhost/project04"
};

module.exports = function(environment) {
  return dbURIs[environment];
}