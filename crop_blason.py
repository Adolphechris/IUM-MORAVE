from PIL import Image, ImageOps

img_path = '/home/adolphe/IUM-MORAVE/apps/web/public/images/logo-crest.jpg'
clean_path = '/home/adolphe/IUM-MORAVE/apps/web/public/images/blason-clean.png'
gray_path = '/home/adolphe/IUM-MORAVE/apps/web/public/images/blason-gray.png'

img = Image.open(img_path)
width, height = img.size

left = int(width * 0.055)
top = int(height * 0.055)
right = int(width * 0.945)
bottom = int(height * 0.96)

cropped = img.crop((left, top, right, bottom))
cropped.save(clean_path)

gray = ImageOps.grayscale(cropped)
gray.save(gray_path)

print("CROPPED_AND_SAVED")
