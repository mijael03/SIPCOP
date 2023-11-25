import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
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
  await page.click('button[class="mr-2 mb-2 mat-raised-button mat-button-base mat-accent"')
  await page.waitForSelector('div[formarrayname="serenos"]')
  await page.type('input[formcontrolname="numeroDocumento"', '40414483')
  await page.click('button[aria-label="Buscar"]')
  await page.waitForFunction(() => {
    const loaderSpinner = document.getElementById('loaderSpinner');
    return loaderSpinner.style.display === 'none';
  }, {timeout: 3000});
  await page.click('mat-select[formcontrolname="idOrigen"]')
  const selectPatrullaje = await page.$x('//mat-option[contains(.//span, " PATRULLAJE ")]');
  await selectPatrullaje[0].click()
  await page.click('mat-select[formcontrolname="idNaturalezaPersonal"]')
  const selectSerenazgo = await page.$x('//mat-option[contains(.//span, " PATRULLAJE MUNICIPAL - SERENAZGO ")]');
  await selectSerenazgo[0].click()
  await page.click('mat-select[formcontrolname="idIdentificacionEfectivoPnp"]')
  const selectEfectivoPnp = await page.$x('//mat-option[contains(.//span, " NO IDENTIFICADO ")]');
  await selectEfectivoPnp[0].click()
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
  const siguienteButton = await page.$x('//button[contains(.//span,"Siguiente")]');
  await siguienteButton[0].click()
  await page.click('mat-select[formcontrolname="idGenerico"')
  const selectTipoApoyo = await page.$x('//mat-option[contains(.//span, " APOYO CIUDADANO ")]');
  await selectTipoApoyo[0].click()
  await page.click('mat-select[formcontrolname="idEspecifico"')
  const selectSubTipo = await page.$x('//mat-option[contains(.//span, " BUENAS COSTUMBRES ")]');
  await selectSubTipo[0].click()
  await page.click('mat-select[formcontrolname="idModalidad"')
  const selectModalidad = await page.$x('//mat-option[contains(.//span, " CONSUMO DE LICOR EN LA VIA PUBLICA O INTERIOR DE VEHICULO ")]');
  await selectModalidad[0].click()
  const siguienteButton2 = await page.$x('//button[contains(.//span,"Siguiente")]');
  await siguienteButton2[0].click()
  await waitOneSecond()
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();

async function waitOneSecond() {
  return new Promise(resolve => {
    setTimeout(resolve, 30000); // 30000 milliseconds = 30 seconds
  });
}