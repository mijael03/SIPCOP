import puppeteer from "puppeteer";

(async () => {
  const urlGenerateUuid = "https://seguridadciudadana.mininter.gob.pe/cloudgateway/msb-parteocurrencia/msbparteocurrencia/partesocurrencias/generateuuid"
  const urlApplyEdits = "https://seguridadciudadana.mininter.gob.pe/arcgis/rest/services/sipcopm/partedeocurrencias/FeatureServer/0/applyEdits"
  let objUuid = ""
  //const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch(
    {
      headless: true,
      userDataDir: './cache',
      args: [
        '--no-sandbox',
        '--use-gl=egl',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    }
  );
  const page = await browser.newPage();
  page.on('console', async msg => {
    const args = msg.args()
    args.forEach(async (arg) => {
      const val = await arg.jsonValue()
      // value is serializable
      if (JSON.stringify(val) !== JSON.stringify({})) console.log(val)
      // value is unserializable (or an empty oject)
      else {
        const { type, subtype, description } = arg._remoteObject
        console.log(`type: ${type}, subtype: ${subtype}, description:\n ${description}`)
      }
    })
  });
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://seguridadciudadana.mininter.gob.pe/sipcop-m/');
  // Wait for the username and password fields to appear in the DOM
  await page.waitForSelector('input[formcontrolname="username"]');
  await page.waitForSelector('input[formcontrolname="password"]');
  // Fill in the login form
  await page.type('input[formcontrolname="username"]', 'NDELGADOD');
  await page.type('input[formcontrolname="password"]', 'SIPCOPM5068');
  // Submit the form
  const iniciarSesionButton = await page.$x('//button[contains(.//span, "Iniciar Sesión")]');
  await iniciarSesionButton[0].click()
  // Wait for navigation to complete or for a specific element on the next page
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  await page.click('a[href="/sipcop-m/partes-ocurrencias"]')
  console.log("Waiting for charge first screen")
  await page.waitForFunction(() => {
    const loaderSpinner = document.getElementById('loaderSpinner');
    return loaderSpinner.style.display === 'none';
  }, { timeout: 45000 });
  console.log("First screen charge completed")
  await page.click('button[class="mr-2 mb-2 mat-raised-button mat-button-base mat-accent"]')
  // Interceptamos las solicitudes de red para capturar la respuesta
  const responseHandler = async (response) => {
    // Verificamos si la URL de la respuesta coincide con la solicitud que nos interesa
    if (response.url().includes(urlGenerateUuid)) {
      // Extraemos el cuerpo de la respuesta como texto
      const responseBody = await response.text();
      // Convertimos el cuerpo de la respuesta en un objeto (o estructura de datos según el formato)
      const responseObject = JSON.parse(responseBody);
      // Accedemos a la propiedad deseada dentro del objeto
      objUuid = responseObject.obj; // Modificar según la estructura de la respuesta
      console.log('UUID:', objUuid);
      // Eliminamos el event listener ahora que hemos capturado la respuesta deseada
      page.off('response', responseHandler);
    }
  };
  page.on('response', responseHandler)
  await page.waitForSelector('div[formarrayname="serenos"]')
  await page.type('input[formcontrolname="numeroDocumento"', '40414483')
  await page.click('button[aria-label="Buscar"]')
  await page.waitForFunction(() => {
    const loaderSpinner = document.getElementById('loaderSpinner');
    return loaderSpinner.style.display === 'none';
  }, { timeout: 30000 });
  const selectorOrigen = 'mat-select[formcontrolname="idOrigen"]'
  await page.waitForSelector(selectorOrigen)
  await page.click('mat-select[formcontrolname="idOrigen"]')
  const selectPatrullaje = await page.$x('//mat-option[contains(.//span, " PATRULLAJE ")]');
  await selectPatrullaje[0].click()
  const selectorNaturalezaPersonal = 'mat-select[formcontrolname="idNaturalezaPersonal"]'
  await page.waitForSelector(selectorNaturalezaPersonal)
  await page.click('mat-select[formcontrolname="idNaturalezaPersonal"]')
  const selectSerenazgo = await page.$x('//mat-option[contains(.//span, " PATRULLAJE MUNICIPAL - SERENAZGO ")]');
  await selectSerenazgo[0].click()
  const selectorIdentificacionEfectivoPnp = 'mat-select[formcontrolname="idIdentificacionEfectivoPnp"]'
  await page.waitForSelector(selectorIdentificacionEfectivoPnp)
  await page.click('mat-select[formcontrolname="idIdentificacionEfectivoPnp"]')
  const selectEfectivoPnp = await page.$x('//mat-option[contains(.//span, " NO IDENTIFICADO ")]');
  await selectEfectivoPnp[0].click()
  const selectorFormaPatrullaje = 'mat-select[formcontrolname="idFormaPatrullaje"]'
  await page.waitForSelector(selectorFormaPatrullaje)
  await page.click('mat-select[formcontrolname="idFormaPatrullaje"]')
  const selectFormaPatrullaje = await page.$x('//mat-option[contains(.//span, "PATRULLAJE MOTORIZADO EN VEHÍCULO MAYOR")]');
  await selectFormaPatrullaje[0].click()
  await page.type('input[formcontrolname="placaVehiculo"', 'EAA-218')
  await page.click('mat-select[formcontrolname="idTurno"]')
  const selectTurno = await page.$x('//mat-option[contains(.//span, " MAÑANA ")]');
  await selectTurno[0].click()
  await page.click('button[aria-label="Open calendar"]')
  const selectFecha = await page.$x('//table/tbody/tr/td[contains(@aria-label, "1 de diciembre de 2023")]');
  await selectFecha[0].click()
  const selectHour = await page.$x('//ngx-mat-timepicker/form/table/tbody/tr/td/mat-form-field/div/div/div/input[contains(@formcontrolname, "hour")]');
  await selectHour[0].evaluate(input => input.value = '');
  await selectHour[0].type("08")
  const selectMinute = await page.$x('//ngx-mat-timepicker/form/table/tbody/tr/td/mat-form-field/div/div/div/input[contains(@formcontrolname, "minute")]');
  await selectMinute[0].evaluate(input => input.value = '');
  await selectMinute[0].type("08")
  const selectSecond = await page.$x('//ngx-mat-timepicker/form/table/tbody/tr/td/mat-form-field/div/div/div/input[contains(@formcontrolname, "second")]');
  await selectSecond[0].evaluate(input => input.value = '');
  await selectSecond[0].type("08")
  const doneButton = await page.$x('//div/button/span[contains(.//mat-icon,"done")]');
  await doneButton[0].click()
  const [siguienteButton, siguienteButton2, siguienteButton3] = await page.$x('//button[contains(.//span,"Siguiente")]');
  await siguienteButton.click()
  await waitOneSecond()
  const selectorGenerico = 'mat-select[formcontrolname="idGenerico"]'
  await page.waitForSelector(selectorGenerico)
  await page.click(selectorGenerico)
  const [selectTipoApoyo] = await page.$x('//mat-option[contains(.//span, "APOYO CIUDADANO")]');
  await selectTipoApoyo.click()
  await waitOneSecond()
  const selectorEspecifico = 'mat-select[formcontrolname="idEspecifico"]'
  await page.waitForSelector(selectorEspecifico)
  await page.click(selectorEspecifico)
  await waitOneSecond()
  const [selectSubTipo] = await page.$x('//mat-option[contains(.//span, "BUENAS COSTUMBRES")]');
  await selectSubTipo.click()
  await waitOneSecond()
  await page.click('mat-select[formcontrolname="idModalidad"]')
  await page.waitForFunction(() => {
    const loaderSpinner = document.getElementById('loaderSpinner');
    return loaderSpinner.style.display === 'none';
  });
  const selectModalidad = await page.$x('//mat-option[contains(.//span, "CONSUMO DE LICOR EN LA VIA PUBLICA O INTERIOR DE VEHICULO")]');
  await selectModalidad[0].click()
  await waitOneSecond()
  await siguienteButton2.click()
  const selectorIdentificacionAutor = 'mat-select[formcontrolname="idIdentificacionAutor"]';
  await page.waitForSelector(selectorIdentificacionAutor, { visible: true, timeout: 3000 });
  await page.click(selectorIdentificacionAutor)
  const [selectIdentificacionAutor] = await page.$x('//mat-option[contains(.//span, "NO IDENTIFICADO")]');
  await selectIdentificacionAutor.click()
  const selectorPresuntaRelacion = 'mat-select[formcontrolname="idPresuntaRelacion"]'
  await page.waitForSelector(selectorPresuntaRelacion)
  await page.click(selectorPresuntaRelacion)
  const [selectRelacionVictima] = await page.$x('//mat-option[contains(.//span, "DESCONOCIDO")]');
  await selectRelacionVictima.click()
  await siguienteButton3.click()
  const selectorTipoVia = 'mat-select[formcontrolname="idTipoVia"]';
  await page.waitForSelector(selectorTipoVia, { visible: true, timeout: 3000 });
  await page.click(selectorTipoVia)
  await page.waitForFunction(() => {
    const loaderSpinner = document.getElementById('loaderSpinner');
    return loaderSpinner.style.display === 'none';
  });
  await waitOneSecond()
  const [selectTipoVia] = await page.$x('//mat-option[contains(.//span, "CALLE")]');
  await selectTipoVia.click()
  const selectorDireccion = 'input[formcontrolname="direccion"]';
  await page.type(selectorDireccion, 'Ballon')
  const selectorTipoZona = 'mat-select[formcontrolname="idTipoZona"]'
  await page.waitForSelector(selectorTipoZona)
  await page.click(selectorTipoZona)
  const [selectTipoZona] = await page.$x('//mat-option[contains(.//span, "BARRIO")]');
  await selectTipoZona.click()
  await waitToMapCharge()
  const selector = '.esri-view-root';
  const element = await page.$(selector)
  await waitOneSecond()
  await waitOneSecond()
  await page.evaluate((element) => {
    element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
  }, element)
  await waitOneSecond()
  const selectOcurrencia = await page.$x('//span[normalize-space()="Ocurrencia"]')
  await selectOcurrencia[1].click()
  const urlMap = generateURLMap(objUuid)
  await page.screenshot({ path: 'example.png' });
  await page.waitForResponse(response => response.url().includes(urlMap));
  const screenPosition = calculateScreenPosition(-16.4492152, -71.5908848)
  await page.mouse.move(screenPosition.x, screenPosition.y);
  await page.mouse.click(screenPosition.x, screenPosition.y);
  await waitForMovement()
  await waitToMapCharge()
  await page.click('#btnUpdate')
  await page.waitForResponse(response => response.url().includes(urlApplyEdits));
  const selectorEstadoOcurrencia = 'mat-select[formcontrolname="idEstadoOcurrencia"]'
  await page.waitForSelector(selectorEstadoOcurrencia)
  await page.click(selectorEstadoOcurrencia)
  const [selectEstadoOcurrencia] = await page.$x('//mat-option[contains(.//span, "EN PROCESO")]');
  await selectEstadoOcurrencia.click()
  /* const registrarOcurrenciaSelector = '//button[contains(.//span, "Registrar")]'
  const [registrarOcurrenciaButton] = await page.$x(registrarOcurrenciaSelector)
  await registrarOcurrenciaButton.click() */
  await waitToMapCharge()
  await page.screenshot({ path: 'example.png' });
  const divSelector = 'div img[src="./assets/images/avatars/1.jpg"]';
  const divElement = await page.$(divSelector);
  await divElement.click()
  const logoutButtonSelector = '//button[contains(.//span, "Cerrar Sesión")]'
  const [logoutButton] = await page.$x(logoutButtonSelector)
  await logoutButton.click()
  await waitToMapCharge()
  await page.screenshot({ path: 'example1.png' });
  await browser.close();
})()


async function waitOneSecond() {
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
}
async function waitForMovement() {
  return new Promise(resolve => {
    setTimeout(resolve, 100);
  });
}
async function waitToMapCharge() {
  return new Promise(resolve => {
    setTimeout(resolve, 6000);
  });
}

const calculateScreenPosition = (latitude, longitude) => {
  const coeficientX1 = -5.23705582e-01
  const coeficientX2 = 5.83639149e+03

  const coeficientY1 = -6.07778970e+03
  const coeficientY2 = -4.47007937e+00

  const interceptX = 418975.03892783
  const interceptY = -99841.30305214

  const positionX = interceptX + coeficientX1 * latitude + coeficientX2 * longitude
  const positionY = interceptY + coeficientY1 * latitude + coeficientY2 * longitude
  return { x: positionX, y: positionY }

}
const generateURLMap = (uuid) => {
  return `https://seguridadciudadana.mininter.gob.pe/arcgis/rest/services/sipcopm/partedeocurrencias/FeatureServer/0/query?f=json&returnIdsOnly=true&returnCountOnly=true&spatialRel=esriSpatialRelIntersects&where=id_dist%3D%27040123%27%20and%20idocurrencia%3D%27${uuid}%27%20and%20estado%3D%27EN_PROCESO%27&token=`
}