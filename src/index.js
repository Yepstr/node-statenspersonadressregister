import { Curl } from 'node-libcurl';

import XMLParser from './XMLParser';
import XMLFormatter from './XMLFormatter';

const DEFAULT_CONFIG = {
  certPath: '',
  baseUrl: 'https://kt-ext-ws.statenspersonadressregister.se/spar-webservice/SPARPersonsokningService/20150530',
  kundNr: '',
  orgNr: '',
  slutAnvandarId: '',
  verbose: false,
};

class SPAR {
  constructor(config, { parser = null, formatter = null } = {}) {
    this.config = Object.assign({}, DEFAULT_CONFIG, config);

    if (parser === null) {
      this.parser = new XMLParser();
    } else {
      this.parser = parser;
    }

    if (formatter === null) {
      this.formatter = new XMLFormatter();
    } else {
      this.formatter = formatter;
    }
  }

  personSok(fysiskPersonId) {
    const {
      kundNr,
      orgNr,
      slutAnvandarId,
    } = this.config;

    const searchEnvelope = this.formatter.formatPersonsokningFraga(
      fysiskPersonId, kundNr, orgNr, slutAnvandarId
    );

    return this.soapCall(searchEnvelope).then((body) => {
      return new Promise((resolve, reject) => {
        const answer = this.parser.parsePersonsokningResponse(body);
        if (answer.Undantag.length > 0) {
          reject(answer.Undantag);
        } else {
          resolve(answer.PersonsokningSvarsPost);
        }
      });
    });
  }

  soapCall(envelope) {
    const { verbose } = this.config;

    return new Promise((resolve, reject) => {
      const curl = this._getCurl();
      curl.setOpt(Curl.option.HTTPHEADER, [
        'SOAPAction: ""',
        'Content-type: text/xml; charset=utf-8',
      ]);
      curl.setOpt(Curl.option.POSTFIELDS, envelope);

      curl.on('end', (code, body, headers) => {
        if (verbose) {
          console.log('END', code, body, headers);
        }
        resolve(body);
      });

      curl.on('error', (error) => {
        if (verbose) {
          console.log('ERROR', error);
        }
        reject(error);
      });

      curl.on('data', (...args) => {
        if (verbose) {
          console.log('DATA', args);
        }
      });

      curl.on('headers', (...args) => {
        if (verbose) {
          console.log('DATA', args);
        }
      });

      curl.perform();
    });
  }

  _getCurl(endpoint = '') {
    const { baseUrl, certPath, verbose } = this.config;

    const url = `${ baseUrl }${ endpoint }`;

    const curl = new Curl();
    curl.setOpt(Curl.option.SSLCERT, certPath);
    curl.setOpt(Curl.option.SSL_VERIFYPEER, 0);
    curl.setOpt(Curl.option.URL, url);
    if (verbose) {
      curl.setOpt(Curl.option.VERBOSE, true);
    }

    return curl;
  }

  _validateConfig(/* config */) {
    return true;
  }
}

export default SPAR;
