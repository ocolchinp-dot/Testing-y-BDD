from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from time import sleep

import pytest
from pytest_bdd import given, parsers, scenarios, then, when
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


ROOT = Path(__file__).resolve().parents[1]
scenarios(str(ROOT / "features" / "ventas.feature"))


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


@pytest.fixture(scope="session")
def app_url():
    handler = partial(QuietHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    server_thread = Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    yield f"http://127.0.0.1:{server.server_port}/index.html"
    server.shutdown()
    server.server_close()
    server_thread.join(timeout=2)


@pytest.fixture
def browser(app_url):
    options = Options()
    chrome_path = Path("C:/Program Files/Google/Chrome/Application/chrome.exe")
    if chrome_path.exists():
        options.binary_location = str(chrome_path)
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1200")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    driver.get(app_url)
    yield driver
    driver.quit()


def wait_for(browser, locator):
    return WebDriverWait(browser, 5).until(EC.visibility_of_element_located(locator))


def login(browser):
    wait_for(browser, (By.ID, "username")).send_keys("admin")
    browser.find_element(By.ID, "password").send_keys("admin123")
    browser.find_element(By.ID, "login-submit").click()
    wait_for(browser, (By.ID, "app-view"))


@given("que inicio sesión con credenciales válidas")
def inicio_sesion(browser):
    login(browser)


@given(parsers.parse('que selecciono el cliente "{cliente}"'))
def seleccionar_cliente(browser, cliente):
    Select(wait_for(browser, (By.ID, "client-select"))).select_by_visible_text(cliente)


@given("que no selecciono ningún cliente")
def no_seleccionar_cliente(browser):
    Select(wait_for(browser, (By.ID, "client-select"))).select_by_value("")


@given(parsers.parse('selecciono el producto "{producto}"'))
def seleccionar_producto(browser, producto):
    Select(wait_for(browser, (By.ID, "product-select"))).select_by_visible_text(producto)


@given(parsers.parse("ingreso la cantidad {cantidad:d}"))
def ingresar_cantidad(browser, cantidad):
    quantity = browser.find_element(By.ID, "quantity")
    quantity.clear()
    quantity.send_keys(str(cantidad))


@when("registro la venta")
def registrar_venta(browser):
    browser.find_element(By.ID, "register-sale").click()
    sleep(0.1)


@then("la venta se registra correctamente")
def venta_exitosa(browser):
    message = wait_for(browser, (By.ID, "sale-message"))
    assert "Venta registrada correctamente" in message.text


@then(parsers.parse('se muestra el error "{error}"'))
def validar_error(browser, error):
    message = wait_for(browser, (By.ID, "sale-message"))
    assert error in message.text
    assert "error" in message.get_attribute("class")


@then(parsers.parse('el total mostrado es "{total}"'))
def validar_total(browser, total):
    assert browser.find_element(By.ID, "sale-total").text == total


@then(parsers.parse('el stock de "{producto}" es {stock:d}'))
def validar_stock(browser, producto, stock):
    row = browser.find_element(By.CSS_SELECTOR, 'tr[data-product-id="azucar"]')
    assert row.find_element(By.CLASS_NAME, "product-name").text == producto
    assert row.find_element(By.CLASS_NAME, "product-stock").text == str(stock)


@then("se muestra el mensaje de confirmación")
def validar_confirmacion(browser):
    message = wait_for(browser, (By.ID, "sale-message"))
    assert "Venta registrada correctamente" in message.text
    assert "Total: Q18.50" in message.text
    assert "success" in message.get_attribute("class")
