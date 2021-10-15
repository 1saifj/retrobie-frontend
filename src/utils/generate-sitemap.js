const fs = require('fs');
const regularRoutes = require('../routes/routes.json');
const parser = require('xml2json');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

async function getAccessToken() {
  const login = process.env.REACT_APP_ADMIN_USERNAME;
  const password = process.env.REACT_APP_ADMIN_PASSWORD;
  try {
    const {data} = await axios.post('/accounts/login', {
      login,
      password,
    });
    return data.accessToken;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

/**
 *
 * @param {{path: string, exact: boolean, apiPath?: string}[]} allRoutes
 * @param {string} clientBaseUrl
 * @param {string} apiBaseUrl
 * @param {'xml'|'txt'} type
 */
function generateSitemap(
  allRoutes,
  clientBaseUrl,
  apiBaseUrl,
  type
) {

  console.log("Current environment: ", process.env.REACT_APP_ENV)

  async function mapRoutes() {

    if (!apiBaseUrl){
      throw new Error("No api url provided. Exiting...")
    }

    const other = [];

    const all = allRoutes.map(async route => {
        // and return the structure that we want
        if (route.path && route.exact) {
          return {
            loc: {
              $t: clientBaseUrl + route.path,
            },
          };
        } else if (!route.exact && route.apiPath) {
          // extract the param key from the route path
          const routePaths = route.path.match(/(:)\w+/g);

          // if there are 2 params to query
          if (routePaths.length >1){
            // only valid for /brands/all/
            if (routePaths.length === 2) {
              try {
                // get all the brands
                const response = await axios.get(apiBaseUrl + route.apiPath);
                const allBrandsDataLength = response.data.length;
                for (let i = 0; i < allBrandsDataLength; i++) {
                  //for each brand

                  const response1 = await axios.get(
                    apiBaseUrl +
                    // replace any instance of ':name' from the api path
                    // with the 'name' from the response
                    route.childPath.replace(routePaths[0], response.data[i][routePaths[0].slice(1)]),
                  );

                  for (let j = 0; j < response1.data.length; j++) {
                    other.push({
                      loc: {
                        $t: clientBaseUrl +
                          route.path.replace(
                            // replace the name with the actual product name
                            routePaths[0], response.data[i][routePaths[0].slice(1)],
                            // then replace ':slug' with the product slug
                          ).replace(routePaths[1], response1.data[j][routePaths[1].slice(1)]),
                      },
                    });
                  }
                }
              }catch (e){
                console.error(e);
              }
            }else console.error("Not yet implemented")
          }else {
            // otherwise, get the single param
            const itemPath = routePaths[0];
            // and make a simple query that will get
            const url = apiBaseUrl + route.apiPath;
            try {
              const response = await axios.get(url)

              response.data.forEach(item => {
                other.push({
                  loc: {
                    $t: clientBaseUrl + route.path.replace(itemPath, item[itemPath.slice(1)]),
                  },
                });
              });
            }catch (e){
              console.error(e);
            }
          }
        }
        return undefined;
      },
    );
    const allResolved = (await Promise.all(all)).filter(item => item !== undefined)
    // and, finally, remove any items that are undefined
    return allResolved.concat(other);
  }

  if (type === 'txt')
    fs.writeFileSync('./sitemap.txt', allRoutes.map(item => clientBaseUrl + item.path).join('\n'));
  else if (type === 'xml') {

    const sitemapPath = './sitemap.xml';

    //read the xml file
    fs.readFile(sitemapPath, {}, async (err, data) => {
      let sitemapData = data;
      // if the file doesn't exist
      if (err && err.code === 'ENOENT') {
        // create it
        fs.writeFileSync(
          sitemapPath,
          '<?xml version="1.0" encoding="UTF-8"?>',
          {encoding: 'utf-8'},
        );
        // and re-read it
        sitemapData = fs.readFileSync(sitemapPath);
      }

      // we can be sure the file exists at this point
      const sitemapJSON = parser.toJson(sitemapData, {reversible: true});
      const sitemapObject = JSON.parse(sitemapJSON);

      const routes = await mapRoutes();

      sitemapObject['urlset'] = {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        url: routes,
      };

      const sitemapXML = parser.toXml(JSON.stringify(sitemapObject));

      const buildDir = path.resolve(sitemapPath);
      fs.writeFileSync(buildDir, `<?xml version="1.0" encoding="UTF-8"?>${sitemapXML}`);

      console.log('Generated sitemap successfully.');
    });
  } else {
    console.log('Doing nothing. type: ', type);
  }
}

generateSitemap(
  regularRoutes,
  'https://retrobie.com',
  process.env.REACT_APP_ENV === 'development' ? 'http://localhost:2500/api/v2' :
    process.env.REACT_APP_ENV === 'staging' ? 'https://api.staging.retrobie.com/v2' :
      process.env.REACT_APP_ENV === 'production' ? 'https://api.retrobie.com/v2' :
        'http://localhost:2500/api/v2',
  'xml',
);
