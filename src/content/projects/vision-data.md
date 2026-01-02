I've been playing around a lot in the GT7 telemetry ecosystem, including writing a rudimentary data logger, but while the developers do expose a lot of valuable telemetry data over the network, one thing that is oddly missing is steering angle input. Though I'm almost certain that this data lives somewhere where i can tap it directly, I figured this would be a good exercise to dip my toe back into computer vision, so i worked out a simple vision-based approach to extracting it from stored footage.

The basic pipeline is: `Grab full frame >> aggressively crop / mask to only our region of interest >> create a binary mask containing the colors we want >> draw a bounding box around the colored region, and find its center`.

The first step is to capture in-game video and transfer it to the computer, where we can load it into OpenCV. In [this boilerplate code](/vision-data/boilerplate.py) we specify the video filepath, create a capture object, and then loop through the frames until there are none left. We also have some basic input checks for closing the window or pausing playback. At the end we release all resources and close all windows to clean up.

Once we have our basic frame by frame iteration loop working, we need to crop each frame to the center region - we don't want to run detection across the entire frame. The information we care about is in this region of the UI highlighted in green:

<img src="/images/vision-data/full_hud.png" alt="GT7 Game Screenshot" class="full_width">

OpenCV images are essentially stored as (h, w, d) numpy arrays. h and w index each pixel's position in the frame, and d is a color space vector representing the color of the pixel (more on this later). Cropping the image to the desired section is simply a matter of slicing the numpy array, via `frame[930:960, 755:1165]`. Note the somewhat unusual convention of `[y_min:y_max, x_min:x_max]` here - height comes before width.


Let's take a closer look at the result:

<img src="/images/vision-data/cropped_hud.png" alt="GT7 HUD Element" class="full_width">

The steering angle is represented by a moving red dot placed above the RPM display, sweeping left to right in a circular arc to indicate the current steering input. To make the vision task a little easier, I painted the hood of the car matte black in-game - this way there's a reasonably consistent dark background against which to detect the dot.

We also need to further mask out other areas of the frame. Even though the hood of the car is black, the RPM gauge shows red for low RPMs, and the curbs on most tracks are also painted red and white. These red pixels show up in the cropped frame and introduce noise.

[Example Screenshot of Curbs / RPM gauge interfering with dot detection]

We use concentric circular masks - everything above and below the trace region is masked to black, leaving only a small strip of the original frame pixels.

```
mask = np.zeros((image_h, image_w), dtype=np.uint8)
r = 1500
center = (205, 13 + r) 
cv2.circle(mask, center, r+8, 255, -1)
cv2.circle(mask, center, r, 0, -1)
region_mask = cv2.bitwise_and(image, image, mask=mask)
```

Next we need to switch color spaces. OpenCV by default encodes in the BGR color space, eg `d = (b, g, r)` in the `(h, w, d)` numpy array representing the image. Intuitively one might think that to detect red pixels, we need to extract pixels with high values in the red channel, ignoring the other channels.

unfortunately, splitting along b g r channels yields something like this:

<img src="/images/vision-data/rgb_channels.png" alt="RGB Channel Seperation" class="full_width">

<div class="project-source"><a href="https://commons.wikimedia.org/wiki/File:RGB_channels_separation.png">Wikimedia</a></div>

why is this happening? the red channel does not tell us *which* pixels are red - rather, it tells us *how much* red is in each pixel. if we think to back to basic color theory, white for instance is (255, 255, 255), a dark gray might be (50, 50, 50), and purple is (255, 0, 255). instead of showing us only the red pixels on the screen, we see a red tinted version of the full frame - unfortunately not very useful for our purposes.

What we want is the HSV (Hue, Saturation, Value) color space:

<img src="/images/vision-data/hsv_wheel.ppm" alt="HSV Color Wheel" class="full_width">

<div class="project-source"><a href="https://www.researchgate.net/figure/HSV-Color-Model-24-Hue-represents-the-color-itself-or-the-dominant-wavelength_fig3_372136727">ResearchGate</a></div>

In the HSV color space, color tone (eg. Hue) is encoded seperately from brightness (value) and pure-ness (saturation). Here, if we constrain our pixels to only those within this slice of the color wheel, we will effectively capture all red or reddish pixels in our frame.
[hsv diagram showing the red range]

there is one small caveat to the way HSV is represented in openCV. The values for red happen to be at the edge of the values for hue, and openCV does not "wrap around" [write this better]. Therefore to properly capture this range, we actually need to combine two hue ranges, [0-10] and [170-179].

```
# Convert image to HSV Colorspace
hsvImage = cv2.cvtColor(region_mask, cv2.COLOR_BGR2HSV)

# Create Masks from Color Ranges
color_mask1 = cv2.inRange(hsvImage,
	(0, 180, 70), (10, 255, 255))

color_mask2 = cv2.inRange(hsvImage,
	(170, 180, 70), (179, 255, 255))

# Combine
color_mask = cv2.bitwise_or(color_mask1, color_mask2)
```

The resulting mask looks something like this:
[screenshot]

To clean things up a little bit, we apply some blur, and then use `cv2.boundingRect` to find the bounding box for our mask. A little more math gives us the coordinates for the center of our dot! 

```
color_mask = cv2.medianBlur(color_mask, 3)

# Find Center
x, y, w, h = cv2.boundingRect(color_mask)
cx, cy = x + w / 2, y + h / 2
```

As a final step, since we want to extract a normalized value from [-1, 1] for the steering input, we subtract the coordinates from the center of the image, and divide by the absolute max deflection from the center.

`steering_val = (cx - 410)/390`

Note for simplicity, we're assuming the dot is sweeping left to right, and the y value is determined by the UI to keep it positioned above the RPM gauge. There is a possibility that GT7 is actually encoding a rotation rather than a translation. for my purposes I am assuming it is linear, but since we already have the radius and the x and y coordinates, we can use some simple geometry to calculate the rotation, and i leave that as an exercise to the reader :)

And there you have it. A vision-based steering angle extractor. While this is applied to a recording of in-game footage, the algorithm is fast enough to run in real time, and the same principles could be applied to detect steering wheel position in a real car by mounting a small camera behind the wheel and tracking the motion of a sticker.

Until next time!








