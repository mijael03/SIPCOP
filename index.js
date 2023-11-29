import puppeteer from "puppeteer";

(async () => {
  //const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch(
    {
      userDataDir: './cache',
      args: [
        '--no-sandbox',
        '--use-gl=egl',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox'
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
  }, {timeout: 45000});
  console.log("First screen charge completed")
  await page.click('button[class="mr-2 mb-2 mat-raised-button mat-button-base mat-accent"]')
  await page.waitForSelector('div[formarrayname="serenos"]')
  await page.type('input[formcontrolname="numeroDocumento"', '40414483')
  await page.click('button[aria-label="Buscar"]')
  await page.waitForFunction(() => {
    const loaderSpinner = document.getElementById('loaderSpinner');
    return loaderSpinner.style.display === 'none';
  }, {timeout: 3000});
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
  const selectFecha = await page.$x('//table/tbody/tr/td[contains(@aria-label, "23 de noviembre de 2023")]');
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
  const [siguienteButton, siguienteButton2,siguienteButton3] = await page.$x('//button[contains(.//span,"Siguiente")]');
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
  await waitOneSecond()
  const selectModalidad = await page.$x('//mat-option[contains(.//span, "CONSUMO DE LICOR EN LA VIA PUBLICA O INTERIOR DE VEHICULO")]');
  await selectModalidad[0].click()
  await waitOneSecond()
  await siguienteButton2.click()
  const selectorIdentificacionAutor = 'mat-select[formcontrolname="idIdentificacionAutor"]';
  await page.waitForSelector(selectorIdentificacionAutor, { visible: true, timeout: 3000 });
    // Once the element is present, click it
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
    // Once the element is present, click it
  await page.click(selectorTipoVia)
  const [selectTipoVia] = await page.$x('//mat-option[contains(.//span, "CALLE")]');
  selectTipoVia.click()
  const selectorDireccion= 'input[formcontrolname="direccion"]';
  await page.type(selectorDireccion, 'Ballon')
  const selectorTipoZona = 'mat-select[formcontrolname="idTipoZona"]'
  await page.waitForSelector(selectorTipoZona)
  await page.click(selectorTipoZona)
  const [selectTipoZona] = await page.$x('//mat-option[contains(.//span, "BARRIO")]');
  selectTipoZona.click()
  //await waitToMapCharge()
  await waitOneSecond()

  await page.screenshot({ path: 'example.png' });
  const selector = '.esri-view-root';
  await page.waitForSelector(selector);
  // Extract the content inside the specified tag
  const content = await page.$eval(selector, (element) => {
    return element.innerHTML;
  });

  console.log('Content inside map component:', content);
  await browser.close();
})();

async function waitOneSecond() {
  return new Promise(resolve => {
    setTimeout(resolve, 1000); 
  });
}
async function waitToMapCharge() {
  return new Promise(resolve => {
    setTimeout(resolve, 60000); 
  });
}