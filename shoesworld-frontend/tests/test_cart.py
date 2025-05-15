import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoAlertPresentException

def test_add_to_cart():
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)
    driver.get("http://localhost:5173")

    # Đăng nhập nếu cần
    if "Đăng nhập" in driver.page_source:
        driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys("test@gmail.com")
        driver.find_element(By.XPATH, "//input[@placeholder='Mật khẩu']").send_keys("123456")
        driver.find_element(By.XPATH, "//button[contains(text(),'Đăng nhập')]").click()
        time.sleep(2)

    # Vào chi tiết sản phẩm
    wait.until(EC.presence_of_element_located((By.PARTIAL_LINK_TEXT, "Xem")))
    driver.find_elements(By.PARTIAL_LINK_TEXT, "Xem")[0].click()

    # Nhấn nút 'THÊM VÀO GIỎ'
    try:
        add_button = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            "//button[normalize-space()='THÊM VÀO GIỎ']"
        )))
        add_button.click()

        # ✅ BẮT VÀ ĐÓNG ALERT TRƯỚC KHI TIẾP TỤC
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            assert "thêm" in alert.text.lower()
            alert.accept()
        except NoAlertPresentException:
            pass

    except:
        driver.save_screenshot("error_add_button.png")
        assert False, "❌ Không tìm thấy hoặc không click được nút 'THÊM VÀO GIỎ'"

    # ✅ Chờ redirect rồi vào giỏ hàng
    time.sleep(2)
    driver.get("http://localhost:5173/cart")
    time.sleep(2)
    assert "SKU" in driver.page_source or "Sản phẩm" in driver.page_source, "❌ Sản phẩm không được thêm vào giỏ"

    driver.quit()
#test thanh cong