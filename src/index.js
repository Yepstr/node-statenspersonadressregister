import fs from 'fs';
import request from 'request';

import XMLParser from './XMLParser';
import XMLFormatter from './XMLFormatter';

const DEFAULT_CONFIG = {
  certPath: '',
  passphrase: '',
  baseUrl: 'https://kt-ext-ws.statenspersonadressregister.se/spar-webservice/SPARPersonsokningService/20160213',
  kundNr: '',
  orgNr: '',
  slutAnvandarId: '',
  verbose: false,
};

class SPAR {
  constructor(config, { parser = null, formatter = null } = {}) {
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    this.certificate = fs.readFileSync(this.config.certPath);

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
    const { verbose, baseUrl, passphrase } = this.config;

    const options = {
      url: baseUrl,
      agentOptions: {
        pfx: this.certificate,
        passphrase: passphrase,
      },
      contentType: 'text/xml; charset=utf-8',
      body: envelope,
    };

    return new Promise((resolve, reject) => {
      request.post(options, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }

  _validateConfig(/* config */) {
    return true;
  }
}

export default SPAR;
