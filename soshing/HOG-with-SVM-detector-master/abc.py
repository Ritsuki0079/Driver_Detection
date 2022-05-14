from skimage.feature import hog
from skimage.transform import pyramid_gaussian
import joblib
from skimage import color
from imutils.object_detection import non_max_suppression
import numpy as np
import cv2
from Train_HOG_SVM import nx, ny, pixels_per_cell, cells_per_block, orientations #defines size of training data and sliding window

#define the step size of the sliding window, the confidence score for detection and the overlap threshold
step_size = 2
conf_score = .5
overlap_threshold = .8

# define the sliding window:
def sliding_window(image, stepSize, windowSize):# image is the input, step size is the no.of pixels needed to skip and windowSize is the size of the actual window
    # slide a window across the image
    for y in range(0, image.shape[0], stepSize):# this line and the line below actually defines the sliding part and loops over the x and y coordinates
        for x in range(0, image.shape[1], stepSize):
            # yield the current window
            yield (x, y, image[y: y + windowSize[1], x:x + windowSize[0]])
#%%
# Upload the saved svm model:
model = joblib.load('name_model.npy')

# Test the trained classifier on an image below
scale = 0
detections = []
# read the image you want to detect the object in:
img= cv2.imread(r"C:\\Users\\soshi\\Downloads\\HOG-with-SVM-detector-master\\dataset\\test\\Closed_Eyes")

# Try it with image resized if the image is too big
#img= cv2.resize(img,(300,200)) # can change the size to default by commenting this code out our put in a random number

# defining the size of the sliding window (has to be the same as the size of the image in the training data)
(winW, winH)= (nx,ny)
windowSize=(winW,winH)
downscale=1.5
print(type(img))