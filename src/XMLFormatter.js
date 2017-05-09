import xpath from 'xpath';
import xml from 'xml';
import moment from 'moment';

class XMLFormatter {
  constructor() {

  }

  formatPersonsokningFraga(fysiskPersonId, kundNr, orgNr, slutAnvandarId) {
    const searchData = {
      'spain:SPARPersonsokningFraga': [
        { '_attr': { 'xmlns:spain': 'http://skatteverket.se/spar/instans/1.0' } },
        this._formatSPARIdentity(kundNr, orgNr, slutAnvandarId),
        this._formatSPARPersonsokningFraga(fysiskPersonId),
      ]
    };

    return this._formatSPAREnvelope(searchData);
  }

  _formatSPARIdentity(kundNr, orgNr, slutAnvandarId) {
    return {
      'spako:IdentifieringsInformation': [
        { '_attr': {
          'xmlns:spako': 'http://skatteverket.se/spar/komponent/1.0',
        } },

        { 'spako:KundNrLeveransMottagare': kundNr },
        { 'spako:KundNrSlutkund': kundNr },
        { 'spako:OrgNrSlutkund': orgNr },
        { 'spako:SlutAnvandarId': slutAnvandarId },
        { 'spako:Tidsstampel': moment().format('YYYY-MM-DDTHH:mm:ss.SSSS') }
      ]
    }
  }

  _formatSPARPersonsokningFraga(idNum) {
    return {
      'spako:PersonsokningFraga': [
        { '_attr': {
          'xmlns:spako': 'http://skatteverket.se/spar/komponent/1.0',
        } },

        { 'spako:PersonId': [
          { 'spako:FysiskPersonId': idNum }
        ]}
      ]
    };
  }

  _formatSPAREnvelope(soapBody) {
    return xml({
      'SOAP-ENV:Envelope': [
        { '_attr': {
          'xmlns:SOAP-ENV': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'SOAP-ENV:encodingStyle': 'http://schemas.xmlsoap.org/soap/encoding/'
        } },
        { 'SOAP-ENV:Body': [ soapBody ] }
      ]
    });
  }
}

export default XMLFormatter;
