import time
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_register():
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173/register")
    time.sleep(1)

    driver.find_element(By.XPATH, "//input[@placeholder='Tên người dùng']").send_keys("Test User")
    driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys("test123@gmail.com")
    driver.find_element(By.XPATH, "//input[@placeholder='Mật khẩu']").send_keys("123456")
    driver.find_element(By.XPATH, "//button[text()='Đăng ký']").click()
    time.sleep(2)

    assert "Danh sách sản phẩm" in driver.page_source
    driver.quit()
