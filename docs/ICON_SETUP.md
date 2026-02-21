# Icon Setup

The extension requires a PNG icon at `resources/icon.png`.

## Quick Setup

You can create a simple icon using any of these methods:

### Method 1: Use ImageMagick (if installed)
```bash
convert -size 128x128 xc:blue -pointsize 64 -gravity center -draw "text 0,0 '🤖'" resources/icon.png
```

### Method 2: Use Python PIL (if installed)
```python
from PIL import Image, ImageDraw, ImageFont
img = Image.new('RGB', (128, 128), color='blue')
d = ImageDraw.Draw(img)
d.text((64,64), "🤖", fill='white', anchor="mm")
img.save('resources/icon.png')
```

### Method 3: Manual
1. Open any image editor (Preview, Paint, GIMP, etc.)
2. Create a 128x128 pixel image
3. Add a robot emoji or simple icon
4. Save as `resources/icon.png`

### Method 4: Skip icon (for testing)
Comment out the icon line in package.json:
```json
// "icon": "resources/icon.png",
```

The icon is optional for development/testing but recommended for publishing.
