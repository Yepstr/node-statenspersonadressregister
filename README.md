# node-statenspersonadressregister
A library that can be used to query to SPAR (https://www.statenspersonadressregister.se/).
SPAR is a service that is provided by the Swedish government for access to data about Swedish citizens.
Information on how to gain access to this service can be read on the SPAR website.

## Requirements
Make sure you have your certificate from Steria and the account information you need to access the test servers

Only tested on node 4.6


### cURL
This library uses cURL with PEM certificates to talk to SPAR. If you have a OSX
you can't use the cURL that ships with OSX, you have to recompile it to use openSSL.
You can do that using `homebrew`:
```
brew install curl --with-openssl && brew link curl --force
```

### Convert certificate
The certificate from Steria need to be converted to a format that we can use with `cURL`.
```
openssl pkcs12 -in cert.p12 -clcerts -nodes -out cert.crt
```

## Usage

Make sure your project depend on `node-statenspersonadressregister` and then:

```
import SPAR from 'spar';
const SPAR_OPTIONS = {
  certPath: '', // file path to the certificates that was converted
  kundNr: '', // From SPAR
  orgNr: '', // From SPAR,
  slutAnvandarId: '', // From SPAR,
  baseUrl: '', // url to SPAR
};

const spar = new SPAR(SPAR_OPTIONS);
```

### Personsök

```
spar.personSok(PERSONNUMMER).then((result) => {
  // result is an array of results, should only be 1 entry
}, (error) => {
  // something went wrong, error has more info
});
```


## More information
https://www.statenspersonadressregister.se/download/18.41febba7149eb27c07a50fb/1447748382337/SPAR_Systemgränssnitt_ver_1-74.pdf
