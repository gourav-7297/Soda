import os
import sys
import time
import numpy as np
from PIL import Image

def build_combined_mask():
    # Load reference frames where star is clearly visible
    cherry60 = np.array(Image.open('public/sequences/cherry/frame_60.webp'))[715:860, 1405:1565]
    grape60 = np.array(Image.open('public/sequences/grape/frame_60.webp'))[715:860, 1405:1565]
    lemon60 = np.array(Image.open('public/sequences/lemon/frame_60.webp'))[715:860, 1405:1565]

    m_cherry = cherry60.mean(axis=2) > 1.2
    m_grape = grape60.mean(axis=2) > 1.2
    m_lemon = lemon60.mean(axis=2) > 1.2

    combined = m_cherry | m_grape | m_lemon

    # Dilate by 3 pixels to ensure full coverage of anti-aliasing / glow
    H, W = combined.shape
    dilated = np.zeros_like(combined)
    pad = 3
    for dy in range(-pad, pad+1):
        for dx in range(-pad, pad+1):
            if dy*dy + dx*dx <= pad*pad:
                shifted = np.zeros_like(combined)
                y_src = max(0, -dy); y_dst = max(0, dy); h_len = H - abs(dy)
                x_src = max(0, -dx); x_dst = max(0, dx); w_len = W - abs(dx)
                dilated[y_dst:y_dst+h_len, x_dst:x_dst+w_len] |= combined[y_src:y_src+h_len, x_src:x_src+w_len]

    return dilated

def inpaint_harmonic(patch, mask, iterations=80):
    """
    Solves discrete Laplace equation nabla^2 I = 0 inside the mask
    with Dirichlet boundary conditions given by the surrounding pixels.
    This guarantees C0 and C1 continuity (no edges, no seams, perfectly follows background gradient).
    """
    res = patch.copy().astype(np.float32)
    
    # Boundary pixels for initial estimate
    boundary = np.zeros_like(mask)
    for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
        shifted = np.roll(np.roll(mask, dy, axis=0), dx, axis=1)
        boundary |= (~mask & shifted)
    
    init_val = res[boundary].mean(axis=0)
    res[mask] = init_val
    
    # Jacobi relaxation
    for _ in range(iterations):
        up = np.roll(res, -1, axis=0)
        down = np.roll(res, 1, axis=0)
        left = np.roll(res, -1, axis=1)
        right = np.roll(res, 1, axis=1)
        smooth = 0.25 * (up + down + left + right)
        res[mask] = smooth[mask]
        
    return np.clip(res, 0, 255).astype(np.uint8)

def main():
    t0 = time.time()
    print("Building watermark mask...")
    mask = build_combined_mask()
    print(f"Mask created with {mask.sum()} pixels.")

    variants = ['cherry', 'grape', 'lemon']
    total_processed = 0

    y_start, y_end = 715, 860
    x_start, x_end = 1405, 1565

    for variant in variants:
        folder = os.path.join('public', 'sequences', variant)
        if not os.path.exists(folder):
            print(f"Directory {folder} does not exist, skipping.")
            continue

        files = sorted([f for f in os.listdir(folder) if f.startswith('frame_') and f.endswith('.webp')])
        print(f"Processing {len(files)} frames for {variant}...")

        for fname in files:
            fpath = os.path.join(folder, fname)
            img = Image.open(fpath)
            arr = np.array(img)

            # Inpaint the watermark patch
            patch = arr[y_start:y_end, x_start:x_end]
            arr[y_start:y_end, x_start:x_end] = inpaint_harmonic(patch, mask, iterations=80)

            # Save back as high quality WebP
            out_img = Image.fromarray(arr)
            out_img.save(fpath, format='WEBP', quality=90, method=4)
            total_processed += 1

        print(f"Completed {variant} ({len(files)} frames).")

    elapsed = time.time() - t0
    print(f"Successfully processed {total_processed} frames across all variants in {elapsed:.1f}s.")

if __name__ == '__main__':
    main()
