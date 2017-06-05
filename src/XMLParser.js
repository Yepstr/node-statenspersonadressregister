import { DOMParser } from 'xmldom';
import xpath from 'xpath';

const getDate = (dateStr) => {
  if (dateStr === '9999-12-31') {
    return null;
  }

  return dateStr;
};

/**
 * Given an array of Objects, get the current.
 * It's the one with no `DatumTill`.
 * @return {Object}
 */
const getCurrent = (objects) => {
  let current = null;
  objects.some((object) => {
    if (object.DatumTill === null) {
      current = object;

      return true;
    }

    return false;
  });

  return current;
};

/**
 * @param  {String} utdelningsadress
 * @return {{ utdelningsadress, lagenhet }}
 */
const splitUtdelningsadress = (inUtdelningsadress) => { // esl
  const LGH_REGEX = /\s+(LGH|LÄG)\s+(\d+)/;
  const TR_REGEX = /\s+(\d+)TR/;

  let Utdelningsadress = inUtdelningsadress;
  let Lagenhet;
  let Trappor;

  if (LGH_REGEX.test(Utdelningsadress)) {
    // Get the LGH number
    Lagenhet = Utdelningsadress.match(LGH_REGEX)[2];
    // Get everything except the LGH part
    Utdelningsadress = Utdelningsadress.replace(LGH_REGEX, '');
  }

  if (TR_REGEX.test(Utdelningsadress)) {
    // Get the trappor number
    Trappor = Utdelningsadress.match(TR_REGEX)[1];
    // Remove the trappor part
    Utdelningsadress = Utdelningsadress.replace(TR_REGEX, '');
  }

  return { Utdelningsadress, Lagenhet, Trappor };
};

class XMLParser {
  constructor(namespaces = {
    'spain': 'http://skatteverket.se/spar/instans/1.0',
    'spako': 'http://skatteverket.se/spar/komponent/1.0',
    'SOAP-ENV': 'http://schemas.xmlsoap.org/soap/envelope/',
  }) {
    this.select = xpath.useNamespaces(namespaces);
  }

  parsePersonsokningResponse(response) {
    const dom = (new DOMParser()).parseFromString(response);

    const UndantagNodes = this.select('//spako:Undantag', dom);
    const PersonsokningSvarsPostNodes = this.select('//spako:PersonsokningSvarsPost', dom);

    return {
      Undantag: UndantagNodes
        .map((UndantagNode) => this.parseUndantag(UndantagNode)),
      PersonsokningSvarsPost: PersonsokningSvarsPostNodes
        .map((node) => this.parsePersonsokningSvarsPost(node)),
    };
  }

  parsePersonsokningSvarsPost(personsokningSvarsPostNode) {
    const getString = this._getStringCreator(personsokningSvarsPostNode);

    const PersonId = this.select('spako:PersonId', personsokningSvarsPostNode)
      .map((PersonIdNode) => this.parsePersonId(PersonIdNode));

    const Persondetaljer = this.select('spako:Persondetaljer', personsokningSvarsPostNode)
      .map((persondetaljer) => this.parsePersondetaljer(persondetaljer));
    const AktuellPersondetaljer = getCurrent(Persondetaljer);

    const Folkbokforingsadresser = this.select('//spako:Folkbokforingsadress', personsokningSvarsPostNode)
      .map((address) => this.parseFolkbokforingsadress(address));
    const AktuellFolkbokforingsadress = getCurrent(Folkbokforingsadresser);

    return {
      PersonId,

      Sekretessmarkering: getString('Sekretessmarkering'),
      SekretessAndringsdatum: getDate(getString('SekretessAndringsdatum')),
      SenasteAndringSPAR: getDate(getString('SenasteAndringSPAR')),

      Persondetaljer,
      AktuellPersondetaljer,
      Folkbokforingsadresser,
      AktuellFolkbokforingsadress,
    };
  }

  parsePersonId(node) {
    const getString = this._getStringCreator(node);

    return {
      FysiskPersonId: getString('FysiskPersonId'),
    };
  }

  parsePersondetaljer(node) {
    const getString = this._getStringCreator(node);
    const fornamns = getString('Fornamn').split(' ');

    // Tilltalsnamn is saved in SPAR as a 2 digit code
    // if the second number is 0 then the first number
    // defines which of the first names are the Tilltalsnamn
    // (index starts at 1)
    let tilltalsnamn = '';
    const tilltalsnamnCode = getString('Tilltalsnamn');
    if (tilltalsnamnCode === '') {
      tilltalsnamn = fornamns[0];
    } else {
      const [a, b] =
        tilltalsnamnCode
        .split('') // Make the code an array
        .map((c) => parseInt(c, 10)) // convert the strings to numbers
        .map((i) => i - 1); // make the name index start at 0

      if (b === -1) {
        tilltalsnamn = fornamns[a];
      } else {
        tilltalsnamn = `${ fornamns[a] } ${ fornamns[b] }`;
      }
    }

    return {
      DatumFrom: getDate(getString('DatumFrom')),
      DatumTill: getDate(getString('DatumTill')),
      Fornamn: fornamns,
      Tilltalsnamn: tilltalsnamn,
      Efternamn: getString('Efternamn'),
      Aviseringsnamn: getString('Aviseringsnamn'),
      HanvisningspersonNrByttTill: getString('HanvisningspersonNrByttTill'),
      HanvisningspersonNrByttFran: getString('HanvisningspersonNrByttFran'),
      Avregistreringsdatum: getDate(getString('Avregistreringsdatum')),
      AvregistreringsorsakKod: getString('AvregistreringsorsakKod'),
      Fodelsetid: getDate(getString('Fodelsetid')),
      Kon: getString('Kon'),
    };
  }

  parseFolkbokforingsadress(node) {
    const getString = this._getStringCreator(node);

    return {
      DatumFrom: getDate(getString('DatumFrom')),
      DatumTill: getDate(getString('DatumTill')),
      CareOf: getString('CareOf'),
      DistriktKod: getString('DistriktKod'),
      FolkbokfordKommunKod: getString('FolkbokfordKommunKod'),
      FolkbokfordLanKod: getString('FolkbokfordLanKod'),
      Folkbokforingsdatum: getDate(getString('Folkbokforingsdatum')),
      Utdelningsadress1: splitUtdelningsadress(getString('Utdelningsadress1')),
      Utdelningsadress2: splitUtdelningsadress(getString('Utdelningsadress2')),
      PostNr: getString('PostNr'),
      Postort: getString('Postort'),
    };
  }

  parseUtlandsadress(node) {
    const getString = this._getStringCreator(node);

    return {
      Utdelningsadress1: splitUtdelningsadress(getString('Utdelningsadress1')),
      Utdelningsadress2: splitUtdelningsadress(getString('Utdelningsadress2')),
      Utdelningsadress3: splitUtdelningsadress(getString('Utdelningsadress3')),
      Land: getString('Land'),
    };
  }

  parseUndantag(node) {
    const getString = this._getStringCreator(node);

    return {
      Kod: getString('Kod'),
      Beskrivning: getString('Beskrivning'),
    };
  }

  _getStringCreator(node, prefix = 'spako:') {
    return (key) => this.select(`${ prefix }${ key }/text()`, node).toString();
  }
}

export default XMLParser;
