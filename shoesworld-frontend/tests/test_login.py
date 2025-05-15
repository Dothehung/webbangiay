from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def test_login_success():
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173")
    time.sleep(1)  # đợi trang tải

    # Nhập email và password bằng placeholder
    driver.find_element(By.XPATH, '//input[@placeholder="Email"]').send_keys("test@gmail.com")
    driver.find_element(By.XPATH, '//input[@placeholder="Mật khẩu"]').send_keys("123456")

    # Nhấn nút đăng nhập
    driver.find_element(By.XPATH, '//button[contains(text(),"Đăng nhập")]').click()
    time.sleep(2)

    # Kiểm tra đã chuyển đến trang home
    assert "Danh sách sản phẩm" in driver.page_source

    driver.quit()
#test thanh cong