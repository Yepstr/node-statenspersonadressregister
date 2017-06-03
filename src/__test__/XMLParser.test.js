import XMLParser from '../XMLParser';

const SPAR_XML_RESPONSE_2016 = `
<?xml version="1.0" encoding="utf-8" ?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/>
    <SOAP-ENV:Body>
        <SPARPersonsokningSvar xmlns="http://skatteverket.se/spar/instans/1.0">
            <spako:PersonsokningFraga xmlns:spako="http://skatteverket.se/spar/komponent/1.0">
                <spako:PersonId>
                    <spako:FysiskPersonId>198904079558</spako:FysiskPersonId>
                </spako:PersonId>
            </spako:PersonsokningFraga>
            <spako:PersonsokningSvarsPost xmlns:spako="http://skatteverket.se/spar/komponent/1.0">
                <spako:PersonId>
                    <spako:FysiskPersonId>198904079558</spako:FysiskPersonId>
                </spako:PersonId>
                <spako:Sekretessmarkering>N</spako:Sekretessmarkering>
                <spako:SenasteAndringSPAR>2016-08-30</spako:SenasteAndringSPAR>
                <spako:Persondetaljer>
                    <spako:DatumFrom>2009-09-10</spako:DatumFrom>
                    <spako:DatumTill>9999-12-31</spako:DatumTill>
                    <spako:Fornamn>Fornamn Tilltalsnamn</spako:Fornamn>
                    <spako:Tilltalsnamn>20</spako:Tilltalsnamn>
                    <spako:Efternamn>Efternamn</spako:Efternamn>
                    <spako:Fodelsetid>1989-04-07</spako:Fodelsetid>
                    <spako:Kon>M</spako:Kon>
                </spako:Persondetaljer>
                <spako:Adresser>
                    <spako:Folkbokforingsadress>
                        <spako:DatumFrom>2016-08-30</spako:DatumFrom>
                        <spako:DatumTill>9999-12-31</spako:DatumTill>
                        <spako:Utdelningsadress2>GATAN 123 LGH 1234</spako:Utdelningsadress2>
                        <spako:PostNr>59242</spako:PostNr>
                        <spako:Postort>Postorten</spako:Postort>
                        <spako:FolkbokfordLanKod>06</spako:FolkbokfordLanKod>
                        <spako:FolkbokfordKommunKod>23</spako:FolkbokfordKommunKod>
                        <spako:Folkbokforingsdatum>2014-08-25</spako:Folkbokforingsdatum>
                        <spako:DistriktKod>112042</spako:DistriktKod>
                    </spako:Folkbokforingsadress>
                    <spako:Folkbokforingsadress>
                        <spako:DatumFrom>2016-01-05</spako:DatumFrom>
                        <spako:DatumTill>2016-08-30</spako:DatumTill>
                        <spako:Utdelningsadress2>ANDRA GATAN 567 2TR</spako:Utdelningsadress2>
                        <spako:PostNr>18204</spako:PostNr>
                        <spako:Postort>Staden</spako:Postort>
                        <spako:FolkbokfordLanKod>04</spako:FolkbokfordLanKod>
                        <spako:FolkbokfordKommunKod>17</spako:FolkbokfordKommunKod>
                        <spako:Folkbokforingsdatum>2014-08-25</spako:Folkbokforingsdatum>
                        <spako:DistriktKod>39203</spako:DistriktKod>
                    </spako:Folkbokforingsadress>
                    <spako:Folkbokforingsadress>
                        <spako:DatumFrom>2014-08-26</spako:DatumFrom>
                        <spako:DatumTill>2016-01-05</spako:DatumTill>
                        <spako:Utdelningsadress2>VÄGEN 2 2TR</spako:Utdelningsadress2>
                        <spako:PostNr>24813</spako:PostNr>
                        <spako:Postort>PLATSEN</spako:Postort>
                        <spako:FolkbokfordLanKod>04</spako:FolkbokfordLanKod>
                        <spako:FolkbokfordKommunKod>11</spako:FolkbokfordKommunKod>
                        <spako:FolkbokfordForsamlingKod>02</spako:FolkbokfordForsamlingKod>
                        <spako:Folkbokforingsdatum>2014-08-25</spako:Folkbokforingsdatum>
                    </spako:Folkbokforingsadress>
                    <spako:Folkbokforingsadress>
                        <spako:DatumFrom>2011-02-09</spako:DatumFrom>
                        <spako:DatumTill>2014-08-26</spako:DatumTill>
                        <spako:Utdelningsadress2>STIGEN 152 LGH 1612</spako:Utdelningsadress2>
                        <spako:PostNr>49252</spako:PostNr>
                        <spako:Postort>Byn</spako:Postort>
                        <spako:FolkbokfordLanKod>25</spako:FolkbokfordLanKod>
                        <spako:FolkbokfordKommunKod>98</spako:FolkbokfordKommunKod>
                        <spako:FolkbokfordForsamlingKod>12</spako:FolkbokfordForsamlingKod>
                        <spako:Folkbokforingsdatum>2011-01-31</spako:Folkbokforingsdatum>
                    </spako:Folkbokforingsadress>
                </spako:Adresser>
            </spako:PersonsokningSvarsPost>
        </SPARPersonsokningSvar>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
`;

describe('The parser can parse SPAR bodies', () => {
  it('hejsan', () => {
    const parser = new XMLParser();
    const answer = parser.parsePersonsokningResponse(SPAR_XML_RESPONSE_2016);

    expect(answer).toMatchSnapshot();

    expect(true).toBe(true);
  });
});
