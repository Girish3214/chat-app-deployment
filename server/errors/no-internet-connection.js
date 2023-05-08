import CustomAPIError from "./custom-api.js";

class NoInternetConnection extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 502;
  }
}

export default NoInternetConnection;
