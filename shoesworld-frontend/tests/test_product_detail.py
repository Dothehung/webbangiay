from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoAlertPresentException
import time

def test_add_to_cart():
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173")
    time.sleep(1)

    # Đăng nhập nếu chưa login
    if "Đăng nhập" in driver.page_source:
        driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys("test@gmail.com")
        driver.find_element(By.XPATH, "//input[@placeholder='Mật khẩu']").send_keys("123456")
        driver.find_element(By.XPATH, "//button[contains(text(),'Đăng nhập')]").click()
        time.sleep(2)

    # Chờ và click vào sản phẩm đầu tiên
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.PARTIAL_LINK_TEXT, "Xem")))
    driver.find_elements(By.PARTIAL_LINK_TEXT, "Xem")[0].click()
    time.sleep(2)

    try:
        # ✅ Cách an toàn: tìm theo class đặc trưng của nút 'THÊM VÀO GIỎ'
        add_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((
                By.XPATH,
                "//button[contains(@class, 'bg-red-600') and contains(., 'GIỎ')]"
            ))
        )

        driver.execute_script("arguments[0].scrollIntoView(true);", add_button)
        add_button.click()

        # ✅ Xử lý alert nếu có
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            assert "thêm" in alert.text.lower()
            alert.accept()
        except NoAlertPresentException:
            pass

        time.sleep(1)

    except Exception as e:
        driver.save_screenshot("error_add_to_cart_fixed.png")
        raise AssertionError(f"❌ Không tìm thấy hoặc không click được nút 'THÊM VÀO GIỎ': {e}")

    driver.quit()
#test thanh cong