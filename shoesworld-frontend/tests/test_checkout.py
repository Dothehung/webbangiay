import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoAlertPresentException

def test_checkout():
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)
    driver.get("http://localhost:5173")

    # Đăng nhập nếu cần
    if "Đăng nhập" in driver.page_source:
        driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys("test@gmail.com")
        driver.find_element(By.XPATH, "//input[@placeholder='Mật khẩu']").send_keys("123456")
        driver.find_element(By.XPATH, "//button[contains(text(),'Đăng nhập')]").click()
        time.sleep(2)

    # Vào trang chi tiết sản phẩm đầu tiên
    wait.until(EC.presence_of_element_located((By.PARTIAL_LINK_TEXT, "Xem")))
    driver.find_elements(By.PARTIAL_LINK_TEXT, "Xem")[0].click()

    # Nhấn THÊM VÀO GIỎ
    add_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'THÊM VÀO GIỎ')]")))
    add_button.click()

    # ✅ Nếu có alert, xử lý nó
    try:
        WebDriverWait(driver, 5).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        alert.accept()
    except NoAlertPresentException:
        pass

    # ✅ Sau khi xử lý alert → mới đi tới trang giỏ hàng
    driver.get("http://localhost:5173/cart")

    # ✅ Đợi input tên và nhập thông tin
    name_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Nhập họ tên tại đây...']")))
    name_input.send_keys("Nguyễn Văn A")

    phone_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Nhập số điện thoại...']")))
    phone_input.send_keys("0123456789")

    # ✅ Nhấn nút thanh toán
    checkout_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Thanh toán')]")))
    checkout_button.click()

    # Tuỳ bạn: kiểm tra alert hoặc chuyển trang
    time.sleep(1)

    driver.quit()
#test thanh cong