import zlib
import struct
import math
import os

def create_png(width, height, draw_func):
    """Creates a valid 32-bit RGBA PNG using only Python standard library."""
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend((r, g, b, a))

    def make_chunk(chunk_type, data):
        length = len(data)
        crc = zlib.crc32(chunk_type + data) & 0xffffffff
        return struct.pack('>I', length) + chunk_type + data + struct.pack('>I', crc)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    compressed = zlib.compress(bytes(raw_data), 9)

    return header + make_chunk(b'IHDR', ihdr) + make_chunk(b'IDAT', compressed) + make_chunk(b'IEND', b'')

def rounded_rect_dist(x, y, w, h, r):
    # Distance to rounded rect boundary
    dx = max(r - x, 0, x - (w - r))
    dy = max(r - y, 0, y - (h - r))
    return math.sqrt(dx*dx + dy*dy)

def draw_icon(x, y, w, h, is_maskable=False):
    # Normalized coords
    nx = x / float(w)
    ny = y / float(h)

    # Base background gradient (indigo 600 to indigo 950)
    # #4f46e5 (79, 70, 229) to #1e1b4b (30, 27, 75)
    t = (nx + ny) / 2.0
    bg_r = int(79 * (1 - t) + 30 * t)
    bg_g = int(70 * (1 - t) + 27 * t)
    bg_b = int(229 * (1 - t) + 75 * t)
    bg_a = 255

    if not is_maskable:
        # Rounded corner for standard icon
        r = w * 0.22
        dx = max(r - x, 0, x - (w - r))
        dy = max(r - y, 0, y - (h - r))
        dist = math.sqrt(dx*dx + dy*dy)
        if dist > r:
            return 0, 0, 0, 0
        elif dist > r - 1.5:
            alpha = int(255 * (r - dist) / 1.5)
            bg_a = max(0, min(255, alpha))

    # Center card (terminal window)
    cx, cy = w * 0.5, h * 0.5
    scale = 0.70 if is_maskable else 0.80
    cw, ch = w * scale, h * scale * 0.85
    cx0, cy0 = cx - cw/2, cy - ch/2
    cx1, cy1 = cx + cw/2, cy + ch/2

    if cx0 <= x <= cx1 and cy0 <= y <= cy1:
        # Terminal header bar
        if y < cy0 + ch * 0.18:
            # Header dark slate #0f172a
            # Buttons: red, amber, green
            by = cy0 + ch * 0.09
            r_btn = ch * 0.035
            b1 = cx0 + cw * 0.08
            b2 = cx0 + cw * 0.15
            b3 = cx0 + cw * 0.22
            
            d1 = math.hypot(x - b1, y - by)
            d2 = math.hypot(x - b2, y - by)
            d3 = math.hypot(x - b3, y - by)
            if d1 <= r_btn:
                return 244, 63, 94, 255 # red
            if d2 <= r_btn:
                return 251, 191, 36, 255 # amber
            if d3 <= r_btn:
                return 16, 185, 129, 255 # emerald
            return 15, 23, 42, 255
        
        # Terminal body #1e293b
        # Let's draw brackets < / >
        # Bracket coordinates
        # Left bracket <
        lx1, ly1 = cx - cw * 0.28, cy - ch * 0.12
        lx2, ly2 = cx - cw * 0.40, cy + ch * 0.05
        lx3, ly3 = cx - cw * 0.28, cy + ch * 0.22

        # Right bracket >
        rx1, ry1 = cx + cw * 0.28, cy - ch * 0.12
        rx2, ry2 = cx + cw * 0.40, cy + ch * 0.05
        rx3, ry3 = cx + cw * 0.28, cy + ch * 0.22

        def dist_to_segment(px, py, x1, y1, x2, y2):
            l2 = (x2-x1)**2 + (y2-y1)**2
            if l2 == 0: return math.hypot(px-x1, py-y1)
            t = max(0, min(1, ((px-x1)*(x2-x1) + (py-y1)*(y2-y1)) / l2))
            proj_x = x1 + t * (x2 - x1)
            proj_y = y1 + t * (y2 - y1)
            return math.hypot(px - proj_x, py - proj_y)

        th = cw * 0.04
        d_l1 = dist_to_segment(x, y, lx1, ly1, lx2, ly2)
        d_l2 = dist_to_segment(x, y, lx2, ly2, lx3, ly3)
        d_r1 = dist_to_segment(x, y, rx1, ry1, rx2, ry2)
        d_r2 = dist_to_segment(x, y, rx2, ry2, rx3, ry3)
        # Slash /
        d_slash = dist_to_segment(x, y, cx + cw * 0.08, cy - ch * 0.16, cx - cw * 0.08, cy + ch * 0.26)

        if min(d_l1, d_l2, d_r1, d_r2) <= th:
            return 56, 189, 248, 255 # cyan #38bdf8
        if d_slash <= th:
            return 245, 158, 11, 255 # amber #f59e0b

        # Inner body background
        return 30, 41, 59, 255 # slate 800

    return bg_r, bg_g, bg_b, bg_a

os.makedirs('public', exist_ok=True)

# 192x192
with open('public/pwa-192x192.png', 'wb') as f:
    f.write(create_png(192, 192, lambda x, y, w, h: draw_icon(x, y, w, h, False)))

# 512x512
with open('public/pwa-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, lambda x, y, w, h: draw_icon(x, y, w, h, False)))

# Maskable 512x512
with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, lambda x, y, w, h: draw_icon(x, y, w, h, True)))

# Apple touch icon 180x180
with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(create_png(180, 180, lambda x, y, w, h: draw_icon(x, y, w, h, False)))

# Favicon 64x64
with open('public/favicon.ico', 'wb') as f:
    f.write(create_png(64, 64, lambda x, y, w, h: draw_icon(x, y, w, h, False)))

print("PWA PNG icons generated successfully!")
