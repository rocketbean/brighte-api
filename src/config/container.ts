export default {
  name: global.checkout(process.env.APPNAME, "Chasi"),

  /**
   * Default Controllers Directory,
   * Chasi will autoload this directoy
   * as controllers, when
   * [Router][controllersDir] property
   * is missing from the config.
   * this controllers will only be
   * registered if the [JS][TS]file
   * is a type of controller
   */
  ControllerDir: "container/controllers",

  /**
   * Service Bootstrap
   * boostrapping app services
   */
  ServiceBootstrap: {
    /* * * * * * * * * * * * * * * * * *
     * this settings is mostly for
     * * * * * * * [Chasi] extensions * * * *
     * this services is left outside the Chasi box due to the
     * interactions developers need to associate with this services,
     * therefore giving more versatility for dev's
     */
    compiler: "container/services/CompilerEngineServiceProvider",
    routers: "container/services/RouterServiceProvider",
    sockets: "container/services/SocketServiceProvider",
  },

  /**
   * Middlewares
   * any middlewares pointed to a
   * route or route group or even in a route
   * containers, should be registered here
   */
  middlewares: {
    /**
     * Register your middlewares here.
     * [alias] => "<your middleware path in (container/middlewares/*)>"
     * after registration the middlewares will then
     * be installed to that Chasi Route MWs Repository,
     * then you can use it in your routes
     */
    auth: "./container/middlewares/Auth",
    testmode: "./container/middlewares/TestMode.mw",
    userparams: "./container/middlewares/UserParams.mw",
    validparams: "./container/middlewares/ValidParams.mw",
    userUpdatableField: "./container/middlewares/UserUpdatableField.mw",
    validProductId: "./container/middlewares/ValidProductId.mw",
    validServiceId: "./container/middlewares/ValidServiceId.mw",
    validUserId: "./container/middlewares/ValidUserId.mw",
  },

  session: {
    cache: false,
    useLogStream: true,
  },
};
