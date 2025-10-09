"""
Simple icon generator for the Ultimate Web Toolkit extension
Creates 16x16, 48x48, and 128x128 PNG icons
Requires: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw
    
    def create_icon(size, filename):
        # Create image with gradient-like background
        img = Image.new('RGB', (size, size), color='#6366f1')
        draw = ImageDraw.Draw(img)
        
        # Draw a simple tools icon (wrench shape)
        if size >= 48:
            # Draw wrench handle
            handle_width = size // 8
            handle_height = size // 2
            handle_x = size // 3 - handle_width // 2
            handle_y = size // 4
            draw.rectangle(
                [handle_x, handle_y, handle_x + handle_width, handle_y + handle_height],
                fill='white'
            )
            
            # Draw wrench head
            head_size = size // 4
            head_x = handle_x - head_size // 4
            head_y = handle_y + handle_height
            draw.ellipse(
                [head_x, head_y, head_x + head_size, head_y + head_size // 2],
                fill='white'
            )
            
            # Draw screwdriver
            sd_x = size * 2 // 3
            sd_y = size // 4
            sd_width = size // 10
            sd_height = size // 2
            draw.rectangle(
                [sd_x, sd_y, sd_x + sd_width, sd_y + sd_height],
                fill='white'
            )
            
            # Draw screwdriver tip
            tip_points = [
                (sd_x, sd_y + sd_height),
                (sd_x + sd_width, sd_y + sd_height),
                (sd_x + sd_width // 2, sd_y + sd_height + size // 8)
            ]
            draw.polygon(tip_points, fill='white')
        else:
            # For small icon, just draw a simple shape
            margin = size // 4
            draw.rectangle(
                [margin, margin, size - margin, size - margin],
                fill='white'
            )
        
        # Save the icon
        img.save(filename, 'PNG')
        print(f"✓ Created {filename}")
    
    # Generate all three icon sizes
    print("Generating icons...")
    create_icon(16, 'icon16.png')
    create_icon(48, 'icon48.png')
    create_icon(128, 'icon128.png')
    print("\n✅ All icons generated successfully!")
    print("You can now load the extension in Chrome.")
    
except ImportError:
    print("❌ Pillow library not found!")
    print("\nTo generate icons, install Pillow:")
    print("  pip install Pillow")
    print("\nThen run this script again:")
    print("  python generate_icons.py")
    print("\n" + "="*50)
    print("ALTERNATIVE: Use create-icons.html in your browser")
    print("="*50)
