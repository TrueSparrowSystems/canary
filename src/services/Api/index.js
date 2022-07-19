import axios from 'axios';
import {RequestType} from './RequestObject';
export class APIService {
  /**
   * This class manages all the network calls.
   * @constructor
   * @param  {ApiServiceConfig} config configuration object for initializing the Api service.
   */
  constructor(apiConfig) {
    this.apiConfig = apiConfig;
    this.config = {};
    this.urlBuilder.bind(this);
    this.addRequestInterceptors.bind(this);
    this.addResponseInterceptors.bind(this);
    this.get.bind(this);
    this.post.bind(this);
    this.getApiCall.bind(this);
    this.postApiCall.bind(this);
    this.urlBuilder(apiConfig);
    this.axios = axios.create(this.config);
    this.addRequestInterceptors();
    this.addResponseInterceptors();
  }
  /**
   * This function is used to cancel all the ongoing http requests.
   * @returns void
   */
  static cancelAllOngoingRequest() {
    APIService.cancelTokenSource.cancel();
    APIService.cancelTokenSource = axios.CancelToken.source();
  }
  /**
   * Function to make base url for http calls.
   * @param {ApiServiceConfig} config
   * @returns void
   */
  urlBuilder(config) {
    // TODO: add check if the / are present in the params, otherwise add them.
    this.config.baseURL = config.baseURL + config.basePath + config.version;
  }
  /**
   * Function to add the custom headers.
   */
  addRequestInterceptors() {
    this.axios.interceptors.request.use(
      config => {
        config.headers = {...this.apiConfig.headers};
        this.apiConfig?.logger?.info('config: ', config);
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );
  }
  /**
   * Function to intercept the response and checks if it's success or error.
   */
  addResponseInterceptors() {
    this.axios.interceptors.response.use(
      response => {
        this.handleResponseStatus(`${response.status}`);
        if (!response.data.success) {
          return Promise.reject(response.data.error);
        }
        return response;
      },
      error => {
        let response = error.response || {};
        const statusCode = error.response?.status || error.code;
        if (statusCode) {
          this.handleResponseStatus(`${statusCode}`);
        }
        return Promise.reject(response);
      },
    );
  }
  handleResponseStatus(statusCode) {
    if (statusCode && this.apiConfig.statusCallbacks[statusCode]) {
      this.apiConfig.statusCallbacks[statusCode]();
    }
  }
  /**
   * This function checks if internet connection is enabled or not.
   * @returns boolean
   */
  isInternetConnected() {
    return this.apiConfig.networkService.isInternetAvailable();
  }
  /**
   * This function gets the reponse object when internet is not connected.
   * @returns object
   */
  getNoConnectionResponse() {
    // TODO: Remove hardcoded text.
    return {
      code: 'NO_INTERNET',
      msg: 'No internet connection.',
      error_data: [{msg: 'No internet connection.'}],
    };
  }
  /**
   * This function checks if we need to queue the api or not, if not then it makes get http call.
   * @param  {string} url - Endpoint of the api.
   * @param  {any} params - Parameters requered for the  api.
   * @returns Promise
   */
  get(url, params) {
    if (this.apiConfig?.queue?.isQueueEnabled()) {
      return new Promise((resolve, reject) => {
        const requestObject = {
          type: RequestType.GET,
          url,
          resolver: resolve,
          rejecter: reject,
          data: null,
          params: params || null,
          api: this,
        };
        this.apiConfig.queue.push(requestObject);
      });
    } else {
      return this.getApiCall(url, params);
    }
  }
  /**
   * Function for making get api call.
   * @param  {string} url - url of the http.
   * @param  {any} params - parameters for the api call.
   * @returns Promise
   */
  getApiCall(url, params) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.isInternetConnected()) {
          this.axios
            .get(url, {
              params: {
                ...params,
                _dli: this.apiConfig.deviceLogIdentifier || 0,
              },
            })
            .then(response => {
              this.apiConfig?.logger?.info('Response: ', url, response.data);
              resolve(response);
            })
            .catch(error => {
              this.apiConfig?.logger?.error('[get] error: ', url, error);
              reject(error);
            });
        } else {
          reject(this.getNoConnectionResponse());
        }
      });
    });
  }

  /**
   * Function to check if we need to queue the api or not, if not then it makes post http call.
   * @param  {string} url - Endpoint of the api.
   * @param  {any} data - Parameters requered for the  api.
   * @returns Promise
   */
  post(url, data) {
    if (this.apiConfig?.queue?.isQueueEnabled()) {
      return new Promise((resolve, reject) => {
        const requestObject = {
          type: RequestType.POST,
          url,
          resolver: resolve,
          rejecter: reject,
          data: data,
          params: null,
          api: this,
        };

        this.apiConfig.queue.push(requestObject);
      });
    } else {
      return this.postApiCall(url, data);
    }
  }

  /**
   * Function for making post api call.
   * @param  {string} url - url of the http.
   * @param  {any} params - parameters for the api call.
   * @returns Promise
   */
  postApiCall(url, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const _url = `${url}?_dli=${this.apiConfig.deviceLogIdentifier || 0}`;
        if (this.isInternetConnected()) {
          this.axios
            .post(_url, data)
            .then(response => {
              this.apiConfig?.logger?.info('Response: ', response.data);
              resolve(response);
            })
            .catch(error => {
              this.apiConfig?.logger?.error('[post] error: ', _url, error);
              reject(error);
            });
        } else {
          reject(this.getNoConnectionResponse());
        }
      });
    });
  }
}
APIService.cancelTokenSource = axios.CancelToken.source();
