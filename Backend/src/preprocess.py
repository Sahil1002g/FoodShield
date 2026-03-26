


import cv2
import numpy as np
import pytesseract


def auto_rotate(image):
    try:
        osd = pytesseract.image_to_osd(image)
        angle = 0
        for line in osd.split("\n"):
            if "Rotate" in line:
                angle = int(line.split(":")[1].strip())

        if angle != 0:
            (h, w) = image.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            image = cv2.warpAffine(
                image, M, (w, h),
                flags=cv2.INTER_CUBIC,
                borderMode=cv2.BORDER_REPLICATE
            )
    except:
        pass

    return image


def deskew(image):
    coords = np.column_stack(np.where(image > 0))
    if len(coords) == 0:
        return image

    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(
        image, M, (w, h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE
    )




def preprocess_image(image_path):
    img = cv2.imread(image_path)

    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.threshold(
        blur, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    thresh = deskew(thresh)
    thresh = auto_rotate(thresh)
  

    return thresh



